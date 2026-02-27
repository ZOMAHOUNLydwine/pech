from .schemas import Lesson, Unit

RANKS = [
    {"id": 'novice', "label": 'Novice Curieux', "minXp": 0, "icon": '🌱', "color": 'text-emerald-500 bg-emerald-50'},
    {"id": 'apprentice', "label": 'Apprenti Assidu', "minXp": 500, "icon": '🚀', "color": 'text-blue-500 bg-blue-50'},
    {"id": 'scholar', "label": 'Savant Local', "minXp": 1500, "icon": '🦉', "color": 'text-purple-500 bg-purple-50'},
]

UNITS = [
    {"id": 'u1', "title": 'Premiers pas', "description": 'Les bases essentielles', "color": 'emerald', "order": 1},
    {"id": 'u2', "title": 'Vie Sociale', "description": 'Famille et amis', "color": 'blue', "order": 2},
]

LESSONS = [
    {
        "id": 'l1',
        "unitId": 'u1',
        "title": 'Dire Bonjour',
        "description": 'Saluer le matin et le soir',
        "language": 'fon',
        "difficulty": 'Débutant',
        "xpReward": 50,
        "focusSkill": 'speaking',
        "items": [
            {"id": 'i1', "type": 'learn', "question": 'Bonjour (Matin)', "answer": 'Afon gannji', "pronunciation": 'Ah-fon gan-jee'},
            {"id": 'i2', "type": 'quiz', "question": 'Comment dit-on "Bonjour" le matin ?', "answer": 'Afon gannji', "options": ['Afon gannji', 'Kou do badji', 'Doo nou']},
        ]
    }
]
