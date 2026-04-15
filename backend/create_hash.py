from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mot de passe que vous voulez utiliser
password = "Admin123!"
hashed = pwd_context.hash(password)

print(f"Mot de passe: {password}")
print(f"Hash: {hashed}")