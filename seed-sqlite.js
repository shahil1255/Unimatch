const { sequelize } = require('./models/database');
const University = require('./models/University');
const User = require('./models/User');

const countries = [
  "USA","UK","Canada","Australia","Germany","France","Japan","South Korea","Singapore","Netherlands",
  "Sweden","Norway","Denmark","Finland","Switzerland","Austria","Belgium","Italy","Spain","Portugal",
  "New Zealand","Ireland","Poland","Czech Republic","Hungary","Romania","Bulgaria","Greece","Turkey","UAE",
  "Qatar","Saudi Arabia","Egypt","South Africa","Nigeria","Kenya","Ghana","Ethiopia","Tanzania","Uganda",
  "India","China","Pakistan","Bangladesh","Sri Lanka","Nepal","Malaysia","Indonesia","Philippines","Thailand",
  "Vietnam","Myanmar","Cambodia","Laos","Mongolia","Kazakhstan","Uzbekistan","Kyrgyzstan","Tajikistan","Azerbaijan",
  "Georgia","Armenia","Ukraine","Belarus","Moldova","Lithuania","Latvia","Estonia","Slovakia","Slovenia",
  "Croatia","Serbia","Bosnia","Albania","North Macedonia","Kosovo","Montenegro","Cyprus","Malta","Luxembourg",
  "Iceland","Liechtenstein","Monaco","Andorra","San Marino","Jamaica","Trinidad","Barbados","Cuba","Dominican Republic",
  "Haiti","Guatemala","Honduras","El Salvador","Nicaragua","Costa Rica","Panama","Colombia","Venezuela","Ecuador",
  "Peru","Bolivia","Paraguay","Uruguay","Chile","Argentina","Brazil","Mexico","Morocco","Algeria"
];

const countryCities = {
  "USA": ["New York", "Los Angeles", "Chicago", "Boston", "San Francisco"],
  "UK": ["London", "Manchester", "Birmingham", "Oxford", "Cambridge"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Stuttgart"],
  "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
  "Japan": ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Fukuoka"],
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"],
  "Bangladesh": ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"],
  "Pakistan": ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi"],
  "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"],
  "Singapore": ["Singapore City", "Jurong", "Tampines", "Woodlands"],
  "Netherlands": ["Amsterdam", "Rotterdam", "Utrecht", "Delft"]
};

const programs = [
  { degree:"BSc", field:"Computer Science", duration:"4 Years" },
  { degree:"BSc", field:"Software Engineering", duration:"4 Years" },
  { degree:"BSc", field:"Cyber Security", duration:"4 Years" },
  { degree:"BSc", field:"Data Science", duration:"4 Years" },
  { degree:"BSc", field:"BBA", duration:"4 Years" },
  { degree:"BSc", field:"Mechanical Engineering", duration:"4 Years" },
  { degree:"BSc", field:"Civil Engineering", duration:"4 Years" },
  { degree:"BSc", field:"Architecture", duration:"5 Years" },
  { degree:"BSc", field:"Nursing", duration:"4 Years" },
  { degree:"BSc", field:"Pharmacy", duration:"4 Years" },
  { degree:"BSc", field:"Psychology", duration:"4 Years" },
  { degree:"BSc", field:"Economics", duration:"3 Years" },
  { degree:"BSc", field:"Fine Arts", duration:"4 Years" },
  { degree:"BSc", field:"International Relations", duration:"4 Years" },
  { degree:"Masters", field:"MBA", duration:"2 Years" },
  { degree:"Masters", field:"Project Management", duration:"2 Years" },
  { degree:"Masters", field:"Artificial Intelligence", duration:"2 Years" },
  { degree:"Masters", field:"Public Health", duration:"2 Years" },
  { degree:"Masters", field:"Data Science", duration:"2 Years" },
  { degree:"PhD", field:"Computer Science", duration:"3 Years" },
  { degree:"PhD", field:"Clinical Psychology", duration:"4 Years" },
  { degree:"PhD", field:"Law", duration:"3 Years" }
];

const universityNames = [
    "University of Technology", "State College", "Imperial Academy", "Global Institute", 
    "National Academy", "City University", "Metropolitan Institute", "Royal College",
    "Science & Art Academy", "International Research University"
];

const cgpaOptions = [2.0, 2.3, 2.5, 2.7, 3.0, 3.33, 3.5, 3.67, 3.87, 4.0];
const ieltsOptions = [0, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5];

function pick(arr) { if(!arr) return "Default"; return arr[Math.floor(Math.random() * arr.length)]; }

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Reset DB
    console.log('✅ SQLite Database synced (Resetting for clean seed)');

    let universities = [];
    
    console.log('⏳ Seeding universities across 100+ countries...');
    
    for (const country of countries) {
      const cities = countryCities[country] || ["Capital City", "Major Hub", "Academic Center", "Port City", "Inland Hub"];
      
      for (let i = 0; i < 20; i++) { // 20 per country = ~2200 entries
        const prog = pick(programs);
        const city = pick(cities);
        const uniNameBase = pick(universityNames);
        const streetNum = Math.floor(Math.random() * 999) + 1;
        
        universities.push({
          name: `${country} ${uniNameBase} of ${prog.field} ${i + 1}`,
          country: country,
          city: city,
          address: `${streetNum} Excellence Ave, ${city}`,
          degree: prog.degree,
          field: prog.field,
          duration: prog.duration,
          tuitionCost: Math.floor(Math.random() * 20000) + 5000,
          minCgpa: pick(cgpaOptions),
          minIelts: pick(ieltsOptions),
          minMio: Math.floor(Math.random() * 45) + 50
        });
      }
      
      if (universities.length >= 200) {
          await University.bulkCreate(universities);
          universities = [];
      }
    }

    if (universities.length > 0) {
        await University.bulkCreate(universities);
    }

    const count = await University.count();
    console.log(`✅ Success! Seeded ${count} universities into SQLite.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
