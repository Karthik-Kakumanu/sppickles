import pkg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");

  fileContents.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex < 0) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      return;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
};

loadEnvFile(envPath);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost/sppickles",
});

async function listSessions() {
  console.log("\n📋 Active Admin Sessions:\n");
  
  const result = await pool.query(`
    SELECT 
      id,
      admin_email,
      device_label,
      ip_address,
      created_at,
      last_seen_at,
      expires_at,
      revoked_at,
      (last_seen_at IS NULL OR last_seen_at < CURRENT_TIMESTAMP - interval '30 minutes') as is_stale
    FROM admin_sessions
    WHERE revoked_at IS NULL
    ORDER BY last_seen_at DESC
  `);

  if (result.rows.length === 0) {
    console.log("  No active sessions found.");
    return result.rows;
  }

  result.rows.forEach((session, index) => {
    const staleIndicator = session.is_stale ? " ⚠️ STALE" : "";
    console.log(`${index + 1}. ${session.device_label} (${session.admin_email})`);
    console.log(`   IP: ${session.ip_address || "Unknown"}`);
    console.log(`   Created: ${new Date(session.created_at).toLocaleString()}`);
    console.log(`   Last Seen: ${session.last_seen_at ? new Date(session.last_seen_at).toLocaleString() : "Never"}`);
    console.log(`   Expires: ${new Date(session.expires_at).toLocaleString()}${staleIndicator}`);
    console.log();
  });

  return result.rows;
}

async function cleanupStaleSessions() {
  console.log("\n🧹 Cleaning up stale sessions (not seen for 30+ minutes)...\n");
  
  const result = await pool.query(`
    UPDATE admin_sessions
    SET revoked_at = CURRENT_TIMESTAMP
    WHERE revoked_at IS NULL
    AND (last_seen_at IS NULL OR last_seen_at < CURRENT_TIMESTAMP - interval '30 minutes')
    RETURNING id, admin_email, device_label
  `);

  if (result.rows.length === 0) {
    console.log("  ✓ No stale sessions found to clean up.");
    return;
  }

  console.log(`  ✓ Revoked ${result.rows.length} stale session(s):\n`);
  result.rows.forEach((session) => {
    console.log(`    - ${session.device_label} (${session.admin_email})`);
  });
}

async function main() {
  try {
    const command = process.argv[2] || "list";

    if (command === "list") {
      await listSessions();
    } else if (command === "cleanup") {
      await listSessions();
      await cleanupStaleSessions();
      await listSessions();
    } else if (command === "revoke-all") {
      console.log("\n🔒 Revoking ALL sessions...\n");
      const result = await pool.query(`
        UPDATE admin_sessions
        SET revoked_at = CURRENT_TIMESTAMP
        WHERE revoked_at IS NULL
        RETURNING id, admin_email, device_label
      `);

      console.log(`  ✓ Revoked ${result.rows.length} session(s):\n`);
      result.rows.forEach((session) => {
        console.log(`    - ${session.device_label} (${session.admin_email})`);
      });
    } else {
      console.log(`
Usage: node cleanup-stale-sessions.mjs [command]

Commands:
  list          - List all active sessions (default)
  cleanup       - Revoke sessions not seen for 30+ minutes
  revoke-all    - Revoke ALL sessions (force logout everywhere)
      `);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
