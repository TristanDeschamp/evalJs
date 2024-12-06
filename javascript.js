// Générer un mot de passe aléatoire avec des critères spécifiques
function genererMotDePasse()
{
	const longueur = Math.floor(Math.random() * (16 - 8 + 1)) + 8; // Longueur aléatoire entre 8 et 16 caractères (Trouvé sur StackOverflow)
	const majuscules = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const nombres = "0123456789";
	const caractereSpeciaux = "!@#$%^&*()_+[]{}|;:,.<>?";
	const toutCaracteres = majuscules + majuscules.toLowerCase() + nombres + caractereSpeciaux; // majuscules.toLowerCase() pour avoir également des minuscules dans le mot de passe

	let password = "";
	// Ajout de 2 majuscules, 2 chiffres et 3 caractères spéciaux
	for (let i = 0; i < 2; i++) password += majuscules[Math.floor(Math.random() * majuscules.length)];
	for (let i = 0; i < 2; i++) password += nombres[Math.floor(Math.random() * nombres.length)];
	for (let i = 0; i < 3; i++) password += caractereSpeciaux[Math.floor(Math.random() * caractereSpeciaux.length)];

	// Complète le mot de passe aléatoire jusqu'à la longueur définie avec d'autres caractères aléatoires
	while (password.length < longueur) {
		password += toutCaracteres[Math.floor(Math.random() * toutCaracteres.length)];
	}

	// Mélange le mot de passe (+ sécurisé je trouve)
	password = password.split("").sort(() => Math.random() - 0.5).join("");

	// Assigne le mot de passe généré aux deux champs (Mot de passe et confimation)
	document.getElementById("password").value = password;
	document.getElementById("password2").value = password;
}

// Afficher ou cacher le mot de passe
function toggleVisibiliteMotDePasse()
{
	const champMotDePasse = document.getElementById("password");
	champMotDePasse.type = champMotDePasse.type === "password" ? "text" : "password"; // Si le champ est de type "password" alors bascule en type "text" et vice-versa
}

// Activer ou désactiver le bouton d'inscription en fonction des champs remplis
function validerInscription()
{
	const email = document.getElementById("email").value;
	const couleur = document.getElementById("couleur").value;
	const password = document.getElementById("password").value;
	const password2 = document.getElementById("password2").value;
	const btnSubmit = document.querySelector(".inscription button[name='submit']");
	btnSubmit.disabled = !(email && couleur && password && password2); // Désactivé si un des champ est vide
}

// Valider les champs de connexion et activer le bouton
function validerFormulaireConnexion() {
	const emailLogin = document.getElementById("email_login").value;
	const passwordLogin = document.getElementById("password_login").value;
	const btnConnexion = document.querySelector(".connection button[name='submit']");

	// Active le bouton si les deux champs sont remplis
	btnConnexion.disabled = !(emailLogin && passwordLogin);
}

// Afficher la couleur choisie dans une div
function afficherCouleurSelectionne()
{
	const couleur = document.getElementById("couleur").value;
	const couleurPreview = document.querySelector(".apercu_couleur");
	couleurPreview.style.backgroundColor = couleur;
	couleurPreview.style.width = "100px";
	couleurPreview.style.height = "100px";
}

// Envoi du formulaire d'inscription avec AJAX (J'utilise mon joker JQuery ici Jean-Pierre...)
function envoiFormulaireInscription()
{
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	const password2 = document.getElementById("password2").value;

	console.log({ email, password, password2 });

	// Petite requête AJAX des familles...
	$.ajax({
		type: "POST",
		url: "ajax.php", // Destination du formulaire
		data: { email, password, password2 }, // Données que je lui envoie
		success: function (response) { // Si la requête passe sans problème
			const messageDiv = document.querySelector(".message");
			messageDiv.style.display = "block";

			// Gestion de la réponse de ajax.php
			if (response.includes("Inscription ok")) {
				messageDiv.style.color = "green";
				messageDiv.textContent = "Inscription ok";
			} else if (response.includes("Erreur mot de passe")) {
				messageDiv.style.color = "red";
				messageDiv.textContent = "Erreur mot de passe";
			} else {
				messageDiv.style.color = "red";
				messageDiv.textContent = "Error";
			}
		},
		error: function(nhr, status, error) { // Si il a eu une couille dans le paté
			console.error("Erreur AJAX:", status, error);
		},
	});
}

// Copier les champs d'inscription dans les champs de connexion
function remplirFormulaireConnexion()
{
	document.getElementById("email_login").value = document.getElementById("email").value;
	document.getElementById("password_login").value = document.getElementById("password").value;

	validerFormulaireConnexion(); // Met à jour l'état du bouton
}

// Fonction constructeur pour l'objet Utilisateur
function User(email, password)
{
	this.email = email;
	this.password = password;
}

// Ajouter les événements après que le DOM soit entièrement chargé
document.addEventListener("DOMContentLoaded", () => {
	// Génération du mot de passe
	document.getElementById("genererPassword").addEventListener("click", genererMotDePasse);

	// Voir / cacher le mot de passe
	document.querySelector(".inscription button[name='voirPassword']").addEventListener("click", toggleVisibiliteMotDePasse);

	// Validation des champs d'inscription
	document.querySelector(".inscription").addEventListener("input", validerInscription);

	// Gestion de la séléction de couleur
	document.getElementById("couleur").addEventListener("change", afficherCouleurSelectionne);

	// Envoi et remplissage des formulaires
	document.querySelector(".inscription button[name='submit']").addEventListener("click", (e) => {
		e.preventDefault(); // Empêche l'envoi classique
		envoiFormulaireInscription();
		remplirFormulaireConnexion();
	});

	// Validation des champs de connexion
	document.getElementById("email_login").addEventListener("input", validerFormulaireConnexion);
	document.getElementById("password_login").addEventListener("input", validerFormulaireConnexion);

	// Création d'un utilisateur au clic sur "Connexion"
	document.querySelector(".connection button[name='submit']").addEventListener("click", () => {
		const user = new User(
			document.getElementById("email_login").value,
			document.getElementById("password_login").value
		);
		console.log("Objet Utilisateur crée:", user);
	});
});