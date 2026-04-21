# backend/generate_hash.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Générer un hash pour password123
password = "password123"
hashed = pwd_context.hash(password)

print(f"🔐 Mot de passe : {password}")
print(f"🔑 Hash généré : {hashed}")
print(f"\n✅ Copiez ce hash dans votre seed.sql")

# Vérifier que le hash fonctionne
if pwd_context.verify(password, hashed):
    print("✅ Vérification OK : le hash est valide !")
else:
    print("❌ Échec de vérification")