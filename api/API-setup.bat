@echo off
echo ==========================================================
echo           Assistant d'installation - API Pech
echo ==========================================================

echo.
echo [1/3] Verification de l'environnement virtuel...
if not exist "venv\" (
    echo Creation de l'environnement virtuel en cours...
    python -m venv venv
    if errorlevel 1 (
        echo Erreur: Impossible de creer l'environnement virtuel.
        echo Assurez-vous que python est installe et dans le PATH.
        pause
        exit /b 1
    )
) else (
    echo Environnement virtuel existant detecte.
)

echo.
echo [2/3] Activation et installation des dependances...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo [3/3] Configuration de la base de donnees et .env
python api_setup_script.py

echo.
pause
