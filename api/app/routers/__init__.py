"""
Routers package for Noukpikplon API
"""

from . import auth_simple
from . import users
from . import lessons
from . import admin
from . import payment
from . import resources

__all__ = ["auth_simple", "users", "lessons", "admin", "payment", "resources"]

