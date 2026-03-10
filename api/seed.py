from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

def seed_data():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.Category).first():
            print("Database already seeded.")
            return

        # Create Category
        fon_category = models.Category(
            title="Français -> Fon",
            source_lang="fr",
            target_lang="fon"
        )
        db.add(fon_category)
        db.flush()

        # Create Level 0
        level0 = models.Level(
            category_id=fon_category.id,
            title="Niveau 0",
            subtitle="Immersion Orale",
            color="bg-emerald-500",
            order=0,
            is_locked=False
        )
        db.add(level0)
        db.flush()

        # Create Unit 1
        unit1 = models.Unit(
            level_id=level0.id,
            title="Premiers Mots",
            description="Comprendre sans lire. 100% Audio.",
            color="bg-emerald-100 text-emerald-800",
            order=0
        )
        db.add(unit1)
        db.flush()

        # Create Lessons
        lessons = [
            models.Lesson(unit_id=unit1.id, title="Bonjour !", lesson_type="vocab", xp_reward=100, audio_url="/audio/salutations.mp3", audio_duration="3:45", order=0),
            models.Lesson(unit_id=unit1.id, title="Oui / Non", lesson_type="vocab", xp_reward=100, order=1),
            models.Lesson(unit_id=unit1.id, title="Ça va ?", lesson_type="practice", xp_reward=150, order=2),
        ]
        db.add_all(lessons)
        
        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
