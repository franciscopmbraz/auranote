-- Add html_summary column to summaries table and remove period column
ALTER TABLE summaries ADD COLUMN html_summary text;
ALTER TABLE summaries DROP COLUMN period;
ALTER TABLE summaries DROP COLUMN entries_data;