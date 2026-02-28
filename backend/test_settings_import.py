print("Importing settings module...")
import nestnode_backend.settings as settings_mod
print("Settings module imported successfully!")
print(f"DATABASES: {settings_mod.DATABASES}")
