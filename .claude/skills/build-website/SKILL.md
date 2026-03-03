# /build-website — Build and launch the local website

Build and run the Vite dev server with the user's choice of data source, then open it in the browser.

## Steps

1. **Ask the user which data source to use:**
   Use the AskUserQuestion tool to present two options:
   - **Local database** — Fast, offline-capable. Uses the SQLite inventory at `local-data/inventory.db` via the Vite local-inventory plugin. Best for UI work and browsing parts without network dependency.
   - **Live API** — Connects to `https://api.spepas.com`. Use this when you need real auth, checkout, chat, or other non-inventory features.

2. **If the user chose "Local database":**
   a. Check if the SQLite database file exists at `local-data/inventory.db`.
   b. If it does NOT exist:
      1. **Ask the user for the RapidAPI data folder path** using AskUserQuestion:
         - Explain that the local database needs to be built from exported CSV data.
         - Ask them to provide the absolute path to the RapidAPI folder containing the scraped TecDoc CSVs (manufacturers, models, vehicles, categories, and detailed parts).
      2. **Ask which import mode to use:**
         - **Quick import** (~500 vehicles, fast)
         - **Full import** (all vehicles, slow)
      3. Run the import command with the user-provided path set as `LOCAL_INVENTORY_SRC`:
         - Quick: `LOCAL_INVENTORY_SRC="<user-path>" pnpm local-data:import:quick`
         - Full: `LOCAL_INVENTORY_SRC="<user-path>" pnpm local-data:import`
         Wait for the import to complete.
   c. Set `VITE_USE_LOCAL_DATA=true` in the `.env` file (replace the existing line if present, or append it).

3. **If the user chose "Live API":**
   a. Set `VITE_USE_LOCAL_DATA=false` in the `.env` file (replace the existing line if present, or append it).

4. **Kill any existing dev server:**
   Run `lsof -ti:3000 | xargs kill -9 2>/dev/null` to kill any process already listening on port 3000.

5. **Start the dev server:**
   Run `pnpm dev` in the background using the Bash tool with `run_in_background: true`.

6. **Open the browser:**
   Wait a few seconds for the server to be ready, then use the Bash tool to run:
   ```
   open http://localhost:3000/95668339501103956045/home
   ```

7. **Report to the user:**
   Tell the user which data source is active and that the site has been opened at `http://localhost:3000/95668339501103956045/home`.
