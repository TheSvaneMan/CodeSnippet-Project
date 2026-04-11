import os
import json

def update_jsconfig():
    if os.path.exists("jsconfig.json"):
        try:
            with open("jsconfig.json", "r") as f:
                config = json.load(f)

            if "compilerOptions" not in config:
                config["compilerOptions"] = {}

            # This line silences the "Invalid JSX runtime" warnings
            config["compilerOptions"]["jsx"] = "react-jsx"

            with open("jsconfig.json", "w") as f:
                json.dump(config, f, indent=2)
            print("✅ Updated jsconfig.json: Set jsx to 'react-jsx'")
        except Exception as e:
            print(f"❌ Error updating jsconfig.json: {e}")

def ensure_cjs_configs():
    # Only necessary for files using module.exports while package.json has "type": "module"
    files_to_check = ["tailwind.config.js", "postcss.config.js"]
    for f in files_to_check:
        if os.path.exists(f):
            os.rename(f, f.replace(".js", ".cjs"))
            print(f"✅ Renamed {f} to .cjs")

if __name__ == "__main__":
    update_jsconfig()
    ensure_cjs_configs()
    print("\n🏁 Cleanup complete. Try running 'bun run dev'!")
