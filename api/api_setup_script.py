import os
import sys
import subprocess
import getpass
import secrets

def setup_database():
    print("==================================================")
    print("      Configuration Initiale de la Base de Données")
    print("==================================================")
    
    pg_user = input("Nom d'utilisateur PostgreSQL [postgres]: ").strip() or "postgres"
    pg_pass = getpass.getpass(f"Mot de passe pour '{pg_user}': ").strip()
    
    print("\nConnexion à PostgreSQL pour créer la base 'pech'...")
    try:
        import psycopg2
        from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
        
        # Connect to default postgres database to create a new one
        conn = psycopg2.connect(
            dbname='postgres',
            user=pg_user,
            password=pg_pass,
            host='localhost',
            port='5432'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'pech'")
        exists = cursor.fetchone()
        if not exists:
            cursor.execute('CREATE DATABASE pech')
            print("=> Base de données 'pech' créée avec succès.")
        else:
            print("=> La base de données 'pech' existe déjà.")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Erreur lors de la connexion à PostgreSQL: {e}")
        print("Assurez-vous que PostgreSQL est en cours d'exécution et que vos identifiants sont corrects.")
        sys.exit(1)
        
    print("\nGénération du fichier .env...")
    encoded_pass = pg_pass.replace("@", "%40") # Simple URL encoding
    db_url = f"postgresql://{pg_user}:{encoded_pass}@localhost:5432/pech"
    secret_key = secrets.token_hex(32)
    
    env_content = f"""DATABASE_URL={db_url}
SECRET_KEY={secret_key}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

MAIL_USERNAME=ultrasecure86@gmail.com
MAIL_PASSWORD=krbb iqex zhfe chtd
MAIL_FROM=ultrasecure86@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
"""
    with open(".env", "w") as f:
        f.write(env_content)
    print("=> Fichier .env généré avec succès.")
    
    print("\nCréation des tables et hydratation des données initiales...")
    try:
        # Run load_data script as subprocess so it uses the newly created .env
        env = os.environ.copy()
        subprocess.run([sys.executable, "load_data.py"], env=env, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de l'hydratation des données: {e}")
        sys.exit(1)
        
    print("\n==================================================")
    print("✅ Configuration terminée avec succès !")
    print("   Vous pouvez maintenant démarrer l'API avec:")
    print("   uvicorn main:app --reload")
    print("==================================================")

if __name__ == "__main__":
    setup_database()
