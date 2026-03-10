import json
from datetime import datetime
from database import SessionLocal, engine
from sqlalchemy import text
import models

def load_data():
    # Ensure tables are created
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        with open('seed_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("Nettoyage des tables existantes...")
        # TRUNCATE in reverse FK order to avoid constraint violations,
        # RESTART IDENTITY resets auto-increment sequences,
        # CASCADE handles any remaining FK dependencies.
        db.execute(text("""
            TRUNCATE TABLE user_lesson_progress, lessons, units, levels, categories, users 
            RESTART IDENTITY CASCADE;
        """))
        db.commit()
            
        # Load in order to respect foreign keys
        table_order = [
            (models.User, 'users'),
            (models.Category, 'categories'),
            (models.Level, 'levels'),
            (models.Unit, 'units'),
            (models.Lesson, 'lessons'),
            (models.UserLessonProgress, 'user_lesson_progress')
        ]
        
        for model, table_name in table_order:
            if table_name not in data:
                continue
                
            records = data[table_name]
            print(f"  → Chargement de {len(records)} enregistrements dans '{table_name}'...")
            
            for record_data in records:
                # Handle datetime conversion
                row = dict(record_data)
                for key, value in row.items():
                    if value and isinstance(value, str):
                        try:
                            if 'time' in key or key.endswith('_at') or key in ('last_played', 'subscription_expiry'):
                                row[key] = datetime.fromisoformat(value)
                        except ValueError:
                            pass
                
                # Handle Enum values (UserRole)
                if table_name == 'users' and 'role' in row:
                    row['role'] = models.UserRole(row['role'])
                    
                record = model(**row)
                db.add(record)
                
            db.commit()
            
        print("\n✅ Données chargées avec succès !")
    except Exception as e:
        print(f"Erreur lors du chargement des données: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    load_data()
