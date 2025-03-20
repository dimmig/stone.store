-- Add default category first
INSERT INTO "Category" (id, name, description, "createdAt", "updatedAt")
VALUES (
    'default-category',
    'Default Category',
    'Default category for all products',
    '2025-03-20 18:58:04.592',
    '2025-03-20 18:58:04.592'
);

-- Restore products with all their data
INSERT INTO "Product" (id, name, description, price, images, "categoryId", sizes, colors, "inStock", "createdAt", "updatedAt")
VALUES
    (
        'cm8hprve80000op4upycmwq3e',
        'Sweetshirt',
        'Designed for versatility, this sweatshirt effortlessly transitions from day to night, offering a tailored fit that flatters all body shapes. The durable construction ensures longevity without compromising on quality. Whether you''re headed for a casual outing or a cozy night in, our Signature Comfort Sweatshirt promises to be your go-to choice.',
        22,
        ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1572635196184-84e35138cf22?q=80&w=1000&auto=format&fit=crop'],
        'default-category',
        ARRAY['Ms', 'S', 'Xs', 'XL'],
        ARRAY['#3D5E57', '#B1D5D8', '#DDC7A0'],
        true,
        '2025-03-20 18:58:04.592',
        '2025-03-20 18:58:04.592'
    ),
    (
        'cm8hprvea0001op4upc5phgur',
        'Longsleeve',
        'Designed for versatility, this sweatshirt effortlessly transitions from day to night, offering a tailored fit that flatters all body shapes. The durable construction ensures longevity without compromising on quality. Whether you''re headed for a casual outing or a cozy night in, our Signature Comfort Sweatshirt promises to be your go-to choice.',
        34,
        ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1596755094261-0635b300e9dd?q=80&w=1000&auto=format&fit=crop'],
        'default-category',
        ARRAY['Xs', 'S', 'M'],
        ARRAY['#D6D6D6', '#DDC7A0', '#000000'],
        true,
        '2025-03-20 18:58:04.595',
        '2025-03-20 18:58:04.595'
    ),
    (
        'cm8hprveb0002op4uyus6bmdc',
        'Hoodie',
        'Designed for versatility, this sweatshirt effortlessly transitions from day to night, offering a tailored fit that flatters all body shapes. The durable construction ensures longevity without compromising on quality. Whether you''re headed for a casual outing or a cozy night in, our Signature Comfort Sweatshirt promises to be your go-to choice.',
        55,
        ARRAY['https://images.unsplash.com/photo-1565978771542-0db9ab9ad3de?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1565978771532-0db9ab9ad3df?q=80&w=1000&auto=format&fit=crop'],
        'default-category',
        ARRAY['Xs', 'S', 'L', 'M'],
        ARRAY['#eeeeec', '#bec2c5', '#69676b'],
        true,
        '2025-03-20 18:58:04.596',
        '2025-03-20 18:58:04.596'
    ),
    (
        'cm8hprvec0003op4ur2lqzer8',
        'Winter jacket',
        'Designed for versatility, this sweatshirt effortlessly transitions from day to night, offering a tailored fit that flatters all body shapes. The durable construction ensures longevity without compromising on quality. Whether you''re headed for a casual outing or a cozy night in, our Signature Comfort Sweatshirt promises to be your go-to choice.',
        23,
        ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e4?q=80&w=1000&auto=format&fit=crop'],
        'default-category',
        ARRAY['XL', 'S', 'M'],
        ARRAY['#668C5B', '#67828b', '#a57b69'],
        true,
        '2025-03-20 18:58:04.596',
        '2025-03-20 18:58:04.596'
    ),
    (
        'cm8hprved0004op4ucsoyi13k',
        'Longsleeve-upgr',
        'Designed for versatility, this sweatshirt effortlessly transitions from day to night, offering a tailored fit that flatters all body shapes. The durable construction ensures longevity without compromising on quality. Whether you''re headed for a casual outing or a cozy night in, our Signature Comfort Sweatshirt promises to be your go-to choice.',
        45,
        ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1596755094261-0635b300e9dd?q=80&w=1000&auto=format&fit=crop'],
        'default-category',
        ARRAY['L', 'S', 'M'],
        ARRAY['#1d7f6b', '#2e4d62', '#652d38'],
        true,
        '2025-03-20 18:58:04.597',
        '2025-03-20 18:58:04.597'
    ),
    (
        'cm8hprvee0005op4u9x8i4aox',
        'Stone branded T-shirt',
        'Designed for versatility, this sweatshirt effortlessly transitions from day to night, offering a tailored fit that flatters all body shapes. The durable construction ensures longevity without compromising on quality. Whether you''re headed for a casual outing or a cozy night in, our Signature Comfort Sweatshirt promises to be your go-to choice.',
        44,
        ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1576566588028-4147f3842f28?q=80&w=1000&auto=format&fit=crop'],
        'default-category',
        ARRAY['X', 'Xs', 'Sm', 'L'],
        ARRAY['#C7C7C7', '#cdacba', '#abc1cc', '#383737'],
        true,
        '2025-03-20 18:58:04.598',
        '2025-03-20 18:58:04.598'
    ),
    (
        'cm8hprvef0006op4uduj4isf9',
        'Stone windbreaker',
        'Designed for versatility, this sweatshirt effortlessly transitions from day to night, offering a tailored fit that flatters all body shapes. The durable construction ensures longevity without compromising on quality. Whether you''re headed for a casual outing or a cozy night in, our Signature Comfort Sweatshirt promises to be your go-to choice.',
        22,
        ARRAY['https://images.unsplash.com/photo-1547063364-cdb7d6f9d391?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1547063364-cdb7d6f9d392?q=80&w=1000&auto=format&fit=crop'],
        'default-category',
        ARRAY['M', 'L', 'Sm'],
        ARRAY['#8D8D8F', '#a89a6f', '#363636'],
        true,
        '2025-03-20 18:58:04.599',
        '2025-03-20 18:58:04.599'
    ),
    (
        'cm8hprvef0007op4ud1zh1qzp',
        'Stone shoes',
        'Designed for versatility, this sweatshirt effortlessly transitions from day to night, offering a tailored fit that flatters all body shapes. The durable construction ensures longevity without compromising on quality. Whether you''re headed for a casual outing or a cozy night in, our Signature Comfort Sweatshirt promises to be your go-to choice.',
        124,
        ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1542291026-7eec264c27fe?q=80&w=1000&auto=format&fit=crop'],
        'default-category',
        ARRAY['Xs', 'Sm'],
        ARRAY['#afb884', '#c5a8a7', '#aaa0cb'],
        true,
        '2025-03-20 18:58:04.600',
        '2025-03-20 18:58:04.600'
    ); 