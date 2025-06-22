const pool = require("../config");

const getAllFarmsDb = async ({ limit, offset }) => {
  const { rows } = await pool.query(
    `SELECT * FROM farms 
     WHERE is_active = true 
     ORDER BY created_at DESC 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

const getFarmByIdDb = async ({ id }) => {
  const { rows } = await pool.query(
    "SELECT * FROM farms WHERE farm_id = $1 AND is_active = true",
    [id]
  );
  return rows[0] || null;
};

const createFarmDb = async ({
  name,
  description,
  location,
  practices,
  certifications,
  image_url,
  contact_email,
  contact_phone,
  website,
  established_year,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO farms (
      name, description, location, practices, certifications, 
      image_url, contact_email, contact_phone, website, established_year
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      name,
      description,
      location,
      practices,
      certifications,
      image_url,
      contact_email,
      contact_phone,
      website,
      established_year,
    ]
  );
  return rows[0];
};

const updateFarmDb = async ({
  farm_id,
  name,
  description,
  location,
  practices,
  certifications,
  image_url,
  contact_email,
  contact_phone,
  website,
  established_year,
  is_active,
}) => {
  const { rows } = await pool.query(
    `UPDATE farms SET 
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      location = COALESCE($4, location),
      practices = COALESCE($5, practices),
      certifications = COALESCE($6, certifications),
      image_url = COALESCE($7, image_url),
      contact_email = COALESCE($8, contact_email),
      contact_phone = COALESCE($9, contact_phone),
      website = COALESCE($10, website),
      established_year = COALESCE($11, established_year),
      is_active = COALESCE($12, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE farm_id = $1
    RETURNING *`,
    [
      farm_id,
      name,
      description,
      location,
      practices,
      certifications,
      image_url,
      contact_email,
      contact_phone,
      website,
      established_year,
      is_active,
    ]
  );
  return rows[0] || null;
};

const deleteFarmDb = async ({ id }) => {
  const { rows } = await pool.query(
    "UPDATE farms SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE farm_id = $1 RETURNING *",
    [id]
  );
  return rows[0] || null;
};

const getFarmsByLocationDb = async ({ location, limit, offset }) => {
  const { rows } = await pool.query(
    `SELECT * FROM farms 
     WHERE location ILIKE $1 AND is_active = true 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [`%${location}%`, limit, offset]
  );
  return rows;
};

const getFarmsByCertificationDb = async ({ certification, limit, offset }) => {
  const { rows } = await pool.query(
    `SELECT * FROM farms 
     WHERE $1 = ANY(certifications) AND is_active = true 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [certification, limit, offset]
  );
  return rows;
};

const getTotalFarmsCountDb = async () => {
  const { rows } = await pool.query(
    "SELECT COUNT(*) as total FROM farms WHERE is_active = true"
  );
  return parseInt(rows[0].total);
};

module.exports = {
  getAllFarmsDb,
  getFarmByIdDb,
  createFarmDb,
  updateFarmDb,
  deleteFarmDb,
  getFarmsByLocationDb,
  getFarmsByCertificationDb,
  getTotalFarmsCountDb,
}; 