
window.onload = init;

function init() {

    new Vue({
        el: "#app",
        data: {
            restaurants: [{
                nom: 'café de Paris',
                cuisine: 'Française'
            },
            {
                nom: 'Sun City Café',
                cuisine: 'Américaine'
            }
            ],
            nbRestaurants: 0,
            nbPagesDeResultats: 0,
            nom: '',
            cuisine: '',
            nomAdd: '',
            cuisineAdd: '',
            page: 0,
            pagesize: 10,
            nomRecherche: ""
        },
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },
        methods: {
            getRestaurantsFromServer() {
                let url = "http://localhost:8080/api/restaurants?page=" +
                    this.page +
                    "&pagesize=" + this.pagesize +
                    "&name=" + this.nomRecherche;

                // ARROW FUNCTIONS PRESERVENT LE THIS !!!
                fetch(url)
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((responseJS) => {
                                // Maintenant res est un vrai objet JavaScript
                                console.log("restaurants récupérés");
                                this.restaurants = responseJS.data;
                                this.nbRestaurants = responseJS.count;
                                this.nbPagesDeResultats = Math.ceil(this.nbRestaurants / this.pagesize);
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            supprimerRestaurant(index) {
                let url = "http://localhost:8080/api/restaurants/" + this.restaurants[index]._id;

                fetch(url, {
                    method: "DELETE",
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => {
                                this.getRestaurantsFromServer();
                                console.log("Restaurant supprimé");
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                // On recupère le formulaire
                let form = event.target;

                // On recupere les données du formulaire
                let dataFormulaire = new FormData(form);

                // On envoie une requête POST au serveur
                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                    method: "POST",
                    body: dataFormulaire
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((responseJS) => {
                                // Maintenant res est un vrai objet JavaScript
                                console.log(responseJS.msg);
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

                // On remet les champs du formulaire à zéro
                this.nomAdd = "";
                this.cuisineAdd = "";
            },
            getColor(index) {
                return (index % 2) ? 'white' : 'lightgrey';
            },
            pagePrecedente() {
                if (this.page !== 0) {
                    this.page--;
                    this.getRestaurantsFromServer();
                }
            },
            pageSuivante() {
                if (this.page < this.nbPagesDeResultats) {
                    this.page++;
                    this.getRestaurantsFromServer();
                }
            },
			
			Dernierepage() {
                this.page = (this.nbRestaurants)/10;
                this.getRestaurantsFromServer();
            },
			
			Premierepage() {
                this.page = 0;
                this.getRestaurantsFromServer();
            },
			
            formModifierRestaurant(index) {
                document.getElementById('idModification').value = this.restaurants[index]._id;
                document.getElementById('nomModification').value = this.restaurants[index].name;
                document.getElementById('cuisineModification').value = this.restaurants[index].cuisine;
                document.getElementById('formulaireModification').style.display = "initial";

            },
			
			//r
			/* chercherRestaurants: _.debounce(function () {
				this.page=0;
                this.getRestaurantsFromServer();
            }, 300)*/
			//r
			
            modifierRestaurant(event) {
                // Pour éviter que la page ne se ré-affiche
                event.preventDefault();

                // Récupération du formulaire. Pas besoin de document.querySelector
                // ou document.getElementById puisque c'est le formulaire qui a généré
                // l'événement
                let form = event.target;
                // Récupération des valeurs des champs du formulaire
                // en prévision d'un envoi multipart en ajax/fetch
                let donneesFormulaire = new FormData(event.target);

                let id = form._id.value; // on peut aller chercher la valeur
                // d'un champs d'un formulaire
                // comme cela, si on connait le nom
                // du champ (valeur de son attribut name)

                let url = "http://localhost:8080/api/restaurants/" + id;

                fetch(url, {
                    method: "PUT",
                    body: donneesFormulaire
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((responseJS) => {
                                // Maintenant res est un vrai objet JavaScript
                                console.log(responseJS.msg);
                                document.getElementById('formulaireModification').style.display = "none";
                                this.getRestaurantsFromServer();
                                
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
			
        }
    })
}