import Contact from "../models/contact.js";
import nodemailer from "nodemailer";

export const addContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, propertyType } = req.body;

    console.log('📧 Nouvelle demande de contact reçue:', { name, email, subject });

    // 1️⃣ Enregistrer le contact dans MongoDB
    const contact = new Contact({ name, email, phone, subject, message, propertyType });
    await contact.save();
    console.log('✅ Contact sauvegardé en base de données');

    // 2️⃣ Configurer Nodemailer pour Mailtrap
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "8e53d9d52911ed",
        pass: process.env.MAILTRAP_PASS || "TonPasswordCompletIci"
      },
    });

    // Test de la connexion
    try {
      await transporter.verify();
      console.log('✅ Connexion SMTP vérifiée');
    } catch (error) {
      console.log('❌ Erreur de connexion SMTP:', error.message);
    }

    // 3️⃣ Contenu de l'email avec HTML
    const mailOptions = {
      from: '"Orchid Real Estate" <noreply@orchid-realestate.com>',
      to: process.env.ADMIN_EMAIL || "votre-email@example.com",
      subject: `🏠 Nouvelle demande de contact: ${subject || "Sans objet"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            📧 Nouvelle demande de contact
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Informations du contact :</h3>
            <p><strong>👤 Nom :</strong> ${name}</p>
            <p><strong>📧 Email :</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>📱 Téléphone :</strong> ${phone || "Non précisé"}</p>
            <p><strong>🏠 Type de propriété :</strong> ${propertyType || "Non précisé"}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4F46E5; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">💬 Message :</h3>
            <p style="line-height: 1.6;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              📅 Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>
      `,
      text: `
Nouvelle demande de contact

Nom: ${name}
Email: ${email}
Téléphone: ${phone || "Non précisé"}
Type de propriété: ${propertyType || "Non précisé"}

Message:
${message}

Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
      `,
    };

    // 4️⃣ Envoyer l'email
    console.log('📤 Tentative d\'envoi d\'email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès:', info.messageId);

    res.status(201).json({ 
      message: "Contact enregistré et email envoyé avec succès !",
      contactId: contact._id,
      emailId: info.messageId
    });

  } catch (error) {
    console.error('❌ Erreur dans addContact:', error);
    
    // Réponse détaillée selon le type d'erreur
    if (error.code === 'EAUTH') {
      res.status(500).json({ 
        error: "Erreur d'authentification email. Vérifiez vos credentials Mailtrap.",
        details: error.message
      });
    } else if (error.code === 'ECONNECTION') {
      res.status(500).json({ 
        error: "Impossible de se connecter au serveur email.",
        details: error.message
      });
    } else {
      res.status(500).json({ 
        error: "Erreur serveur, réessayez plus tard.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

// Fonction pour tester l'envoi d'email
export const testEmail = async (req, res) => {
  try {
    console.log('🧪 Test d\'envoi d\'email...');

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "8e53d9d52911ed",
        pass: process.env.MAILTRAP_PASS || "TonPasswordCompletIci"
      },
    });

    // Test de connexion
    await transporter.verify();
    console.log('✅ Connexion SMTP OK');

    // Email de test
    const testMailOptions = {
      from: '"Orchid Real Estate Test" <test@orchid-realestate.com>',
      to: process.env.ADMIN_EMAIL || "test@example.com",
      subject: "🧪 Test d'envoi d'email - Orchid Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🧪 Test d'email réussi !</h2>
          <p>Ceci est un email de test pour vérifier que la configuration fonctionne.</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Serveur :</strong> Mailtrap</p>
          <p style="color: #28a745;">✅ La configuration email fonctionne correctement !</p>
        </div>
      `,
      text: `Test d'email réussi ! Date: ${new Date().toLocaleString('fr-FR')}`
    };

    const info = await transporter.sendMail(testMailOptions);
    console.log('✅ Email de test envoyé:', info.messageId);

    res.status(200).json({
      message: "Email de test envoyé avec succès !",
      messageId: info.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur test email:', error);
    res.status(500).json({
      error: "Échec du test d'email",
      details: error.message
    });
  }
};
