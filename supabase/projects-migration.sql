-- Add image_url column to projects table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE projects ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Update any existing projects that have image field but not image_url
UPDATE projects 
SET image_url = image 
WHERE image_url IS NULL AND image IS NOT NULL;