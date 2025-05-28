import React, {Component} from 'react';
import InputEuro from '../../framework/components/form/InputEuro'
import InputNb from '../../framework/components/form/InputNb'
import InputSelect from '../../framework/components/form/InputSelect'
import {FormattedMessage} from 'react-intl';
import valeurs from '../../baremes/valeur.json';
import str from '../../baremes/valeurs.json';

const SSM = 2703.74;
const Plafondaidetat = 6;

export default class Creche extends Component {

    state = {
      tariffacture:0,
      categorie:{},
      valeur:{},
      values :{},
      errors:[]
    };

    handleFieldChange(fieldId, value) {
      var fieldS = this.state.values;
      fieldS[fieldId] = value;
      this.setState({values:fieldS})
    }

    calculSalaireRerefence(){

      this.setState({errors:[]});

      var salairemensuelle1 = (this.conversionInput(this.state.values.salaireM11) + this.conversionInput(this.state.values.salaireM12) + this.conversionInput(this.state.values.salaireM13)) / 3;
      var salairemensuelle2 = (this.conversionInput(this.state.values.salaireM21) + this.conversionInput(this.state.values.salaireM22) + this.conversionInput(this.state.values.salaireM23)) / 3;
      var salairemensuelle = salairemensuelle1 + salairemensuelle2;

      var salaireannuelle = (this.conversionInput(this.state.values.salaireA1) + this.conversionInput(this.state.values.salaireA2)) / 12;
      var salairereference = 0;
      if(salaireannuelle && !salairemensuelle)
        salairereference = salaireannuelle;
      else if(!salaireannuelle && salairemensuelle)
        salairereference = salairemensuelle;
      else
        salairereference = salairemensuelle>salaireannuelle ? salaireannuelle : salairemensuelle;
      

      this.setState({salairereference:salairereference});

      var categoriesalaire = 8;
      if(salairereference < SSM)
        categoriesalaire = 0;
      else if(salairereference < 1.5*SSM)
        categoriesalaire = 1;
      else if(salairereference < 2*SSM)
        categoriesalaire = 2;
      else if(salairereference < 2.5*SSM)
        categoriesalaire = 3;
      else if(salairereference < 3*SSM)
        categoriesalaire = 4;
      else if(salairereference < 3.5*SSM)
        categoriesalaire = 5;
      else if(salairereference < 4*SSM)
        categoriesalaire = 6;
      else if(salairereference < 4.5*SSM)
        categoriesalaire = 7;

      this.setState({categoriesalaire:categoriesalaire});

      var categorie = this.getCategorie(categoriesalaire, this.state.values.numeroenfant);
      var valeur = valeurs[categoriesalaire];

      this.setState({categorie:categorie,valeur:valeur});

      var nbr = this.state.values.nbrepassemaine;
      var tarifcrecherepas = this.state.values.tarifrepas;
      var heuresgratuites = this.state.values.heuresgratuites;
      var prixparrepas = this.getPrix(tarifcrecherepas,categorie["rp"]);
      var prixrepas = nbr * prixparrepas;
      this.setState({prixrepas:prixrepas, prixparrepas:prixparrepas,nbr:nbr});

      var tarifh = this.state.values.tarifhoraire;


      this.setState({tarifh:tarifh});

      var nbh = this.state.values.nbhsemaine;
      nbh = nbh - heuresgratuites;
      if(nbh < 0) nbh = 0;
      var nbt1 = nbh > valeur["t1"] ? valeur["t1"] : nbh;
      var nbt2 = nbh - nbt1 > valeur["t2"] ? valeur["t2"] : nbh - nbt1;
      var nbt3 = nbh - nbt1 - nbt2 > valeur["t3"] ? valeur["t3"] : nbh - nbt1 - nbt2;
      var nbpt = nbh - nbt1 - nbt2 - nbt3;
      this.setState({nbt1:nbt1,nbt2:nbt2,nbt3:nbt3,nbpt:nbpt,nbh:nbh});

      var p_t1 = this.getPrix(tarifh,categorie["t1"]);
      var p_t2 = this.getPrix(tarifh,categorie["t2"]);
      var p_t3 = this.getPrix(tarifh,categorie["t3"]);
      this.setState({p_t1:p_t1,p_t2:p_t2,p_t3:p_t3});


      var supplement = tarifh > Plafondaidetat ? (tarifh - Plafondaidetat) * nbh : 0;

      this.setState({supplement:supplement});

      var tariffacture = prixrepas + supplement + nbt1 * p_t1 + nbt2 * p_t2 + nbt3 * p_t3 + nbpt * tarifh;

      this.setState({tariffacture:tariffacture})
    }

    getPrix(prixhcreche, participationparental) {
        if(participationparental == "FREE")
            return 0;
      return prixhcreche < participationparental ? prixhcreche : participationparental
    }

    getLien() {
      return "http://www.men.public.lu/fr/enfance/02-cheque-service/participation-parents.pdf";
    }

    getCategorie(categoriesalaire, numeroenfant) {
      return str[categoriesalaire][numeroenfant]
    }

    conversionInput(value) {
      return value ? value : 0
    }

    render() {
        return (
            <div>
              <div className="row col-xs-12">
                <h2><FormattedMessage id="creche.title" /></h2>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className="bs-callout bs-callout-info">
                    <p>Vous trouverez ici un simulateur pour estimer le coût de la crêche de votre enfant au luxembourg.
                    <br/>Le simulateur se base sur les articles publiés sur le site du <a href="https://guichet.public.lu/fr/citoyens/famille-education/parents/garde-enfants/cheque-service.html">guichet.lu</a>
                    <br/>Les données sont données à titre indicatif
                    <br/>Dernière mise à jour des indices : <b>Mai 2025</b></p>
                  </div>
                </div>
              </div>
              <div className="row col-xs-12">
                <h3>Salaire du ménage</h3>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className="bs-callout bs-callout-warning">
                    <p>
                        Renseignez ici les trois dernières fiches de paye et/ou le salaire annuel de vous et de votre conjoint
                        <br/>Le systeme prendra automatiquement le plus faible salaire mensuel moyen
                        <br/>L'ensemble des salaires sous le même toît comptent, que vous soyez pacsés/mariés/célibataires
                        <br/>Attention : il s'agit à chaque fois du salaire <b>imposable</b>
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Conjoint 1: Salaire mensuel 1" onChange={this.handleFieldChange.bind(this,"salaireM11")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Salaire mensuel 2" onChange={this.handleFieldChange.bind(this,"salaireM12")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Salaire mensuel 3" onChange={this.handleFieldChange.bind(this,"salaireM13")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Salaire annuel" onChange={this.handleFieldChange.bind(this,"salaireA1")}  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Conjoint 2: Salaire mensuel 1" onChange={this.handleFieldChange.bind(this,"salaireM21")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Salaire mensuel 2" onChange={this.handleFieldChange.bind(this,"salaireM22")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Salaire mensuel 3" onChange={this.handleFieldChange.bind(this,"salaireM23")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Salaire annuel" onChange={this.handleFieldChange.bind(this,"salaireA2")}  />
                </div>
              </div>
              <div className="row col-xs-12">
                <h3>Creche</h3>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <InputNb label="Nombre de repas par semaine" onChange={this.handleFieldChange.bind(this,"nbrepassemaine")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputNb label="Nombre d'heure par semaine" onChange={this.handleFieldChange.bind(this,"nbhsemaine")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputSelect values={[[1, "1"], [2, "2"], [3, "3"], [4, "4+"]]} label="Rang de l'enfant (1 étant votre premier enfant)" onChange={this.handleFieldChange.bind(this,"numeroenfant")}  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Tarif horaire" onChange={this.handleFieldChange.bind(this,"tarifhoraire")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="Tarif repas" onChange={this.handleFieldChange.bind(this,"tarifrepas")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputNb label="Nombre heures gratuites (valable pour un enfant agé de plus d'un an et qui n'est pas scolairisé)" onChange={this.handleFieldChange.bind(this,"heuresgratuites")}  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <button type="button" onClick={this.calculSalaireRerefence.bind(this)} className="btn btn-primary">Calcul</button>
                </div>
              </div>
              {this.state.tariffacture ?
              <div className="row">
                <br/>
                <div className="col-xs-12">
                  <div className="alert alert-success">
                    Votre participation hebdomadaire s'élève à : {this.state.tariffacture} € soit {this.state.tariffacture*4} € par mois
                  </div>
                  <h4>Explications :</h4>
                  <p>Salaire mensuel de référence : {this.state.salairereference}€.</p>
                  <p>Vous avez donc le droit à :</p>
                  <ul>
                    <li>{this.state.nbt1}h en tarif 1 : {this.state.p_t1}€/h. Total {this.state.nbt1*this.state.p_t1}€</li>
                    <li>{this.state.nbt2}h en tarif 2 : {this.state.p_t2}€/h. Total {this.state.nbt2*this.state.p_t2}€</li>
                    <li>{this.state.nbt3}h en tarif 3 : {this.state.p_t3}€/h. Total {this.state.nbt3*this.state.p_t3}€</li>
                    <li>{this.state.nbpt}h en plein tarif : {this.state.tarifh}€/h. Total {this.state.nbpt*this.state.tarifh}€</li>
                    <li>{this.state.nbr} repas au tarif de {this.state.prixparrepas}€/repas. Total {this.state.prixrepas*this.state.nbr}€</li>
                    {this.state.supplement >0 ?
                    <li>La creche propose un tarif horaire supérieur ({this.state.tarifh}€/h) à ce que l'état prend en charge ({Plafondaidetat}€/h). Cette différence est à vos frais. Total {this.state.supplement}€</li>
                    : []
                    }
                  </ul>
                  <p>Vous trouverez ces informations sur le lien officiel <a target="_blank" href={this.getLien()}>ici</a></p>
                  </div>
                </div>
              : []
              }
              <div id="disqus_thread" />
            </div>
        )
    }
}
