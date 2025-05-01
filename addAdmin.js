import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from './models/Admin.mjs';  // N'oublie pas le .js à la fin pour les modules ES6

dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connexion MongoDB réussie'))
.catch(err => console.error('❌ Erreur MongoDB :', err));

// Créer un admin de test
async function addAdmin() {
  const email = 'admin@test.com';
  const password = 'admin123';  // Le mot de passe sera haché

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log('Cet administrateur existe déjà');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Admin({
    email,
    password: hashedPassword,
  });

  await admin.save();
  console.log('✅ Admin de test créé avec succès !');
  process.exit();
}

addAdmin();
