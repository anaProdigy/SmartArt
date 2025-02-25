DROP TABLE IF EXISTS payments CASCADE;

CREATE TABLE payments (
  id SERIAL PRIMARY KEY NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  total_price DECIMAL NOT NULL,
  stripe_charge_id VARCHAR(255) NOT NULL
);