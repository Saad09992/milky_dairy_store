-- Farm Showcase Table
CREATE TABLE public.farms
(
    farm_id SERIAL NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    location character varying(200) NOT NULL,
    practices text NOT NULL,
    certifications text[],
    image_url character varying(255),
    contact_email character varying(100),
    contact_phone character varying(20),
    website character varying(255),
    established_year integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (farm_id)
);

-- Create index for better performance
CREATE INDEX farms_name_idx ON public.farms (name);
CREATE INDEX farms_location_idx ON public.farms (location);
CREATE INDEX farms_active_idx ON public.farms (is_active);

-- Add some sample data
INSERT INTO public.farms (name, description, location, practices, certifications, image_url, contact_email, contact_phone, website, established_year) VALUES 
('Green Valley Dairy Farm', 'A family-owned dairy farm committed to sustainable farming practices and producing high-quality organic milk products. We focus on animal welfare and environmental conservation.', 'Rural Route 2, Green Valley, CA 90210', 'Organic farming, rotational grazing, sustainable water management, renewable energy usage, waste recycling', ARRAY['USDA Organic', 'Animal Welfare Approved', 'Non-GMO Project Verified'], 'https://i.ibb.co/example/green-valley-farm.jpg', 'info@greenvalleydairy.com', '+1-555-0123', 'https://greenvalleydairy.com', 1985),
('Sunrise Meadows Farm', 'Specializing in artisanal cheese production with traditional methods passed down through generations. Our farm emphasizes quality over quantity and sustainable practices.', '123 Meadow Lane, Sunrise County, NY 10001', 'Traditional cheese making, pasture-raised cattle, natural feed, minimal processing, local distribution', ARRAY['Artisan Cheese Guild', 'Local Food Network', 'Sustainable Agriculture Certified'], 'https://i.ibb.co/example/sunrise-meadows.jpg', 'contact@sunrisemeadows.com', '+1-555-0456', 'https://sunrisemeadows.com', 1972),
('Heritage Hills Farm', 'A multi-generational farm dedicated to preserving traditional farming methods while incorporating modern sustainable practices. We produce a variety of dairy products including milk, cheese, and yogurt.', '456 Heritage Road, Hills District, TX 75001', 'Heritage breed cattle, traditional milking methods, organic feed production, community supported agriculture', ARRAY['Heritage Breed Conservancy', 'Organic Valley Co-op', 'Local Farmers Market Certified'], 'https://i.ibb.co/example/heritage-hills.jpg', 'hello@heritagehills.com', '+1-555-0789', 'https://heritagehillsfarm.com', 1958); 