export type Bike = {
  _id :string
  company: string
  model: string
  ownerId: string
  images: string[]
  rent: number
  rating: number
  reviews: number
  fuel: string
  transmission: string
  seats: number
  mileage: number
  age: number
  distanceCovered: number
  engine: number
  description: string
}

// export const bikes: Bike[] = [
//   {
//     company: "Royal Enfield",
//     model: "Classic 350",
//     image:
//       "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
//     rent: 249,
//     rating: 4.8,
//     reviews: 186,
//     fuel: "Petrol",
//     transmission: "Manual",
//     seats: 2,
//     mileage: 35,
//     age: 2,
//     distanceCovered: 18400,
//     engine: 349,
//     description:
//       "A timeless motorcycle combining classic styling with modern reliability. The Classic 350 is comfortable for city rides, weekend trips and relaxed long-distance journeys.",
//   },

//   {
//     company: "Yamaha",
//     model: "MT-15",
//     image:
//       "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
//     rent: 299,
//     rating: 4.7,
//     reviews: 154,
//     fuel: "Petrol",
//     transmission: "Manual",
//     seats: 2,
//     mileage: 48,
//     age: 1,
//     distanceCovered: 11200,
//     engine: 155,
//     description:
//       "A sporty and lightweight motorcycle designed for riders who enjoy agile handling and energetic performance. Perfect for city commuting and short road trips.",
//   },

//   {
//     company: "KTM",
//     model: "Duke 200",
//     image:
//       "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
//     rent: 349,
//     rating: 4.9,
//     reviews: 138,
//     fuel: "Petrol",
//     transmission: "Manual",
//     seats: 2,
//     mileage: 35,
//     age: 2,
//     distanceCovered: 15600,
//     engine: 199,
//     description:
//       "A sharp and performance-focused street motorcycle with responsive handling and an aggressive design. Great for city rides and enthusiastic weekend trips.",
//   },

//   {
//     company: "Honda",
//     model: "Activa 6G",
//     image:
//       "https://images.unsplash.com/photo-1558980664-10ea8e0f6f5d?auto=format&fit=crop&w=900&q=80",
//     rent: 199,
//     rating: 4.6,
//     reviews: 221,
//     fuel: "Petrol",
//     transmission: "Automatic",
//     seats: 2,
//     mileage: 47,
//     age: 2,
//     distanceCovered: 20800,
//     engine: 109,
//     description:
//       "A practical and economical scooter ideal for everyday city transportation. Easy to ride, fuel efficient and convenient for short-distance travel.",
//   },

//   {
//     company: "TVS",
//     model: "Apache RTR 160",
//     image:
//       "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=80",
//     rent: 279,
//     rating: 4.7,
//     reviews: 117,
//     fuel: "Petrol",
//     transmission: "Manual",
//     seats: 2,
//     mileage: 45,
//     age: 1,
//     distanceCovered: 9800,
//     engine: 159,
//     description:
//       "A sporty motorcycle offering a balance of performance, mileage and everyday usability. A strong option for city rides and weekend journeys.",
//   },

//   {
//     company: "Bajaj",
//     model: "Pulsar 150",
//     image:
//       "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=900&q=80",
//     rent: 229,
//     rating: 4.6,
//     reviews: 164,
//     fuel: "Petrol",
//     transmission: "Manual",
//     seats: 2,
//     mileage: 47,
//     age: 3,
//     distanceCovered: 32600,
//     engine: 149,
//     description:
//       "A dependable everyday motorcycle offering good mileage and comfortable performance. Suitable for city commuting and regular travel.",
//   },

//   {
//     company: "Royal Enfield",
//     model: "Hunter 350",
//     image:
//       "https://images.unsplash.com/photo-1619771914272-e3c1f7e8b8c3?auto=format&fit=crop&w=900&q=80",
//     rent: 329,
//     rating: 4.8,
//     reviews: 103,
//     fuel: "Petrol",
//     transmission: "Manual",
//     seats: 2,
//     mileage: 36,
//     age: 1,
//     distanceCovered: 7600,
//     engine: 349,
//     description:
//       "A modern roadster with a compact design and enjoyable riding experience. The Hunter 350 works well for urban riding as well as weekend getaways.",
//   },

//   {
//     company: "Yamaha",
//     model: "R15 V4",
//     image:
//       "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=80",
//     rent: 399,
//     rating: 4.9,
//     reviews: 89,
//     fuel: "Petrol",
//     transmission: "Manual",
//     seats: 2,
//     mileage: 45,
//     age: 1,
//     distanceCovered: 6900,
//     engine: 155,
//     description:
//       "A sporty faired motorcycle built for riders who enjoy sharp styling and engaging performance. Suitable for city rides and longer highway journeys.",
//   },

//   {
//     company: "Kawasaki",
//     model: "Ninja 300",
//     image:
//       "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
//     rent: 599,
//     rating: 4.9,
//     reviews: 61,
//     fuel: "Petrol",
//     transmission: "Manual",
//     seats: 2,
//     mileage: 30,
//     age: 2,
//     distanceCovered: 13400,
//     engine: 296,
//     description:
//       "A premium sports motorcycle offering strong performance, distinctive styling and a comfortable riding position for longer journeys.",
//   },
// ]