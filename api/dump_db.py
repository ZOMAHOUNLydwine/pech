import json
from datetime import datetime
from enum import Enum
from database import SessionLocal
import models
from sqlalchemy import inspect

def dump_db():
    db = SessionLocal()
    data = {}
    
    # We need to dump in order to respect foreign keys during import
    tables = [
        models.User,
        models.Category,
        models.Level,
        models.Unit,
        models.Lesson,
        models.UserLessonProgress
    ]
    
    for model in tables:
        table_name = model.__tablename__
        records = db.query(model).all()
        table_data = []
        
        for record in records:
            row_dict = {}
            for c in inspect(model).columns:
                val = getattr(record, c.name)
                # Serialize datetimes and enums
                if isinstance(val, datetime):
                    val = val.isoformat()
                elif isinstance(val, Enum):
                    val = val.value
                row_dict[c.name] = val
            table_data.append(row_dict)
            
        data[table_name] = table_data
        
    with open('seed_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    print("Database dumped successfully to seed_data.json")

if __name__ == "__main__":
    dump_db()
