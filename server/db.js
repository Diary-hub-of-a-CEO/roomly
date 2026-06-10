import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleRooms = [
  {
    id: 1,
    name: 'Sunrise Studio',
    type: 'Studio Apartment',
    owner: 'Aria',
    price: 1150,
    noise: 'Low',
    location: 'Campus edge',
    city: 'Kathmandu',
    universities: ['Kathmandu University', 'Tribhuvan University'],
    facilities: ['High-speed Wi-Fi', 'Dedicated office desk', 'In-room kitchenette', 'Daily housekeeping'],
    petsAllowed: true,
    description: 'A calm studio near major universities with quiet study areas and modern amenities.',
    rating: 9,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    distance: '750m'
  },
  {
    id: 2,
    name: 'College Central Room',
    type: 'Single Bed',
    owner: 'Sam',
    price: 760,
    noise: 'Moderate',
    location: 'University district',
    city: 'Patan',
    universities: ['Patan Academy of Health Sciences', 'Kathmandu Medical College'],
    facilities: ['Shared kitchen', 'Study lounge', 'Laundry service'],
    petsAllowed: false,
    description: 'Single bed room designed for students with strong social and study spaces nearby.',
    rating: 8,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    distance: '450m'
  },
  {
    id: 3,
    name: 'Office Loft',
    type: 'Office Space',
    owner: 'Mira',
    price: 1380,
    noise: 'Moderate',
    location: 'Business hub',
    city: 'Lalitpur',
    universities: ['Nepal Open University', 'National College'],
    facilities: ['Meeting pod', 'Printer access', '24/7 access', 'Coffee corner'],
    petsAllowed: true,
    description: 'Bright office space for entrepreneurs and freelancers with campus-inspired convenience.',
    rating: 8,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80',
    distance: '1.2km'
  },
  {
    id: 4,
    name: 'Dual Room Retreat',
    type: 'Double Bed',
    owner: 'Ravi',
    price: 980,
    noise: 'High',
    location: 'Shopping boulevard',
    city: 'Bhaktapur',
    universities: ['Bhaktapur Multiple Campus'],
    facilities: ['Private balcony', 'Gym access', 'Water purifier'],
    petsAllowed: true,
    description: 'Shared double bed stay perfect for roommates looking for city convenience and social life.',
    rating: 7,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    distance: '1.8km'
  },
  {
    id: 5,
    name: 'Quiet Study Nook',
    type: 'Single Bed',
    owner: 'Neha',
    price: 690,
    noise: 'Low',
    location: 'Library cluster',
    city: 'Kathmandu',
    universities: ['Kathmandu University', 'Asian Development Bank Institute'],
    facilities: ['Silent floor', 'Shared kitchen', 'Garden access'],
    petsAllowed: false,
    description: 'Quiet room designed for focused learners near campus libraries and study halls.',
    rating: 9,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    distance: '320m'
  },
  {
    id: 6,
    name: 'City Campus Loft',
    type: 'Studio Apartment',
    owner: 'Isha',
    price: 1040,
    noise: 'Moderate',
    location: 'Campus boulevard',
    city: 'Patan',
    universities: ['Patan Multiple Campus'],
    facilities: ['Balcony', 'Furnished lounge', 'Fast laundry'],
    petsAllowed: true,
    description: 'Stylish studio offering premium finishes and close access to local colleges.',
    rating: 8,
    image: 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=800&q=80',
    distance: '680m'
  },
  {
    id: 7,
    name: 'Bright Room Share',
    type: 'Double Bed',
    owner: 'Kiran',
    price: 920,
    noise: 'Moderate',
    location: 'Market street',
    city: 'Kathmandu',
    universities: ['Nepal Engineering College'],
    facilities: ['Shared kitchen', 'Security system', 'Wi-Fi included'],
    petsAllowed: true,
    description: 'Friendly shared room for students or professionals who want community energy with privacy.',
    rating: 8,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    distance: '1.1km'
  },
  {
    id: 8,
    name: 'Premium Desk & Bed',
    type: 'Single Bed',
    owner: 'Priya',
    price: 810,
    noise: 'Low',
    location: 'Quiet quarter',
    city: 'Lalitpur',
    universities: ['Himalayan University'],
    facilities: ['Desk space', 'Gym membership', 'Breakfast included'],
    petsAllowed: false,
    description: 'Premium student room with study-friendly services and gentle neighborhood pace.',
    rating: 9,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
    distance: '550m'
  }
];

export async function initDb(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY,
      name TEXT,
      type TEXT,
      owner TEXT,
      price INTEGER,
      noise TEXT,
      location TEXT,
      city TEXT,
      universities TEXT,
      facilities TEXT,
      petsAllowed INTEGER,
      description TEXT,
      rating INTEGER,
      image TEXT,
      distance TEXT
    )
  `);

  const row = await db.get('SELECT COUNT(*) AS count FROM rooms');
  if (!row || row.count === 0) {
    const insert = await db.prepare(`
      INSERT INTO rooms (id, name, type, owner, price, noise, location, city, universities, facilities, petsAllowed, description, rating, image, distance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const room of sampleRooms) {
      await insert.run(
        room.id,
        room.name,
        room.type,
        room.owner,
        room.price,
        room.noise,
        room.location,
        room.city,
        JSON.stringify(room.universities),
        JSON.stringify(room.facilities),
        room.petsAllowed ? 1 : 0,
        room.description,
        room.rating,
        room.image,
        room.distance
      );
    }

    await insert.finalize();
  }
}
