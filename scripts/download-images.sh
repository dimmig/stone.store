#!/bin/bash

# Create the images directory if it doesn't exist
mkdir -p public/images

# Download hero image
curl -L "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" -o public/images/hero.jpg

# Download category images
curl -L "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop" -o public/images/clothing.jpg
curl -L "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070&auto=format&fit=crop" -o public/images/accessories.jpg
curl -L "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" -o public/images/footwear.jpg

echo "Images downloaded successfully!" 