import React, {Component, PropTypes} from 'react';
import InputDate from '../../framework/components/form/InputDate.jsx'
import InputText from '../../framework/components/form/InputText.jsx'
import InputEuro from '../../framework/components/form/InputEuro'
import InputNb from '../../framework/components/form/InputNb'
import InputSelect from '../../framework/components/form/InputSelect'
import {FormattedMessage} from 'react-intl';
import valeurs from '../../baremes/valeur.json';
import str2 from '../../baremes/structures-conventionnees-enfants-scolarises.json';
import str1 from '../../baremes/structures-conventionnees-enfants-non-scolarises.json';
import str4 from '../../baremes/structures-non-conventionnees-enfants-scolarises.json';
import str3 from '../../baremes/structures-non-conventionnees-enfants-non-scolarises.json';

const SSM = 1922.96

export default class Creche extends Component {

    state = {
      tariffacture:0,
      categorie:{},
      valeur:{},
      values :{},
    }

    handleFieldChange(fieldId, value) {
      var fieldS = this.state.values
      fieldS[fieldId] = value
      this.setState({values:fieldS})
    }

    calculSalaireRerefence(){
      var salairemensuelle1 = (this.conversionInput(this.state.values.salaireM11) + this.conversionInput(this.state.values.salaireM12) + this.conversionInput(this.state.values.salaireM13)) / 3
      var salairemensuelle2 = (this.conversionInput(this.state.values.salaireM21) + this.conversionInput(this.state.values.salaireM22) + this.conversionInput(this.state.values.salaireM23)) / 3
      var salairemensuelle = salairemensuelle1 + salairemensuelle2

      var salaireannuelle = (this.conversionInput(this.state.values.salaireA1) + this.conversionInput(this.state.values.salaireA2)) / 12
      var salairereference = 0
      if(salaireannuelle && !salairemensuelle)
        salairereference = salaireannuelle
      else if(!salaireannuelle && salairemensuelle)
        salairereference = salairemensuelle
      else
        salairereference = salairemensuelle>salaireannuelle ? salaireannuelle : salairemensuelle

      var categoriesalaire = 8
      if(salairereference < SSM)
        categoriesalaire = 0
      else if(salairereference < 1.5*SSM)
        categoriesalaire = 1
      else if(salairereference < 2*SSM)
        categoriesalaire = 2
      else if(salairereference < 2.5*SSM)
        categoriesalaire = 3
      else if(salairereference < 3*SSM)
        categoriesalaire = 4
      else if(salairereference < 3.5*SSM)
        categoriesalaire = 5
      else if(salairereference < 4*SSM)
        categoriesalaire = 6
      else if(salairereference < 4.5*SSM)
        categoriesalaire = 7


      var categorie = this.getCategorie(this.state.values.structure, categoriesalaire, this.state.values.numeroenfant)
      var valeur = this.getValeur(categoriesalaire)
      var nbr = this.state.values.nbrepassemaine
      var nbh = this.state.values.nbhsemaine

      var tarifh = this.state.values.tarifhoraire
      var tarifrepas = this.state.values.tarifrepas

      var nbag = nbh > valeur["ag"] ? valeur["ag"] : nbh
      var nbcs = nbh - nbag > valeur["cs"] ? valeur["cs"] : nbh - nbag
      var nbsf = nbh - nbag - nbcs > valeur["sf"] ? valeur["sf"] : nbh - nbag - nbcs
      var nbpt = nbh - nbag - nbcs - nbsf

      var prixrepas = nbr * this.getPrix(tarifrepas,categorie["rp"])

      var supplement = tarifh > categorie["pt"] ? (tarifh - categorie["pt"]) * nbpt : 0

      var tariffacture = prixrepas + supplement + nbcs * this.getPrix(tarifh,categorie["cs"]) + nbsf * this.getPrix(tarifh,categorie["sf"]) + nbpt * this.getPrix(tarifh,categorie["pt"])

      this.setState({categorie:categorie,valeur:valeur,tariffacture:tariffacture})
    }

    getPrix(prixhcreche, participationparental) {
      return prixhcreche < participationparental ? prixhcreche : participationparental
    }

    getCategorie(structure, categoriesalaire, numeroenfant) {
      var str = str4;
      if(structure == 1)
        str = str1
      if(structure == 2)
        str = str2
      if(structure == 3)
        str = str3

      return str[categoriesalaire][numeroenfant]
    }

    getValeur(categoriesalaire) {
      if(categoriesalaire > 5)
        return valeurs["1"]
      else if(categoriesalaire < 1)
        return valeurs["2"]
      else return valeurs["0"]
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
                    <br/>Le simulateur se base sur les articles publiés sur le site du <a href="http://www.guichet.public.lu/citoyens/fr/famille/parents/garde-enfants/cheque-service-tarification/index.html">guichet.lu</a>
                    <br/>Dernière mise à jour des indices : Aout 2016</p>
                  </div>
                </div>
              </div>
              <div className="row col-xs-12">
                <h3>Salaire du ménage</h3>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className="bs-callout bs-callout-warning">
                    <p>Renseignez ici les trois dernières fiches de paye et/ou le salaire annuel de vous et de votre conjoint
                    <br/>Le systeme prendra automatiquement le plus faible salaire mensuel moyen
                    <br/>Attention : il s'agit à chaque fois du salaire <b>imposable</b></p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="salaireM11" onChange={this.handleFieldChange.bind(this,"salaireM11")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="salaireM12" onChange={this.handleFieldChange.bind(this,"salaireM12")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="salaireM13" onChange={this.handleFieldChange.bind(this,"salaireM13")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="salaireA1" onChange={this.handleFieldChange.bind(this,"salaireA1")}  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="salaireM21" onChange={this.handleFieldChange.bind(this,"salaireM21")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="salaireM22" onChange={this.handleFieldChange.bind(this,"salaireM22")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="salaireM23" onChange={this.handleFieldChange.bind(this,"salaireM23")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="salaireA2" onChange={this.handleFieldChange.bind(this,"salaireA2")}  />
                </div>
              </div>
              <div className="row col-xs-12">
                <h3>Creche</h3>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <InputNb label="nbrepassemaine" onChange={this.handleFieldChange.bind(this,"nbrepassemaine")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputNb label="nbhsemaine" onChange={this.handleFieldChange.bind(this,"nbhsemaine")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputSelect values={[[1, "1"], [2, "2"], [3, "3"], [4, "4+"]]} label="numeroenfant" onChange={this.handleFieldChange.bind(this,"numeroenfant")}  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <InputSelect values={[[1, "Stucture conventionnée, enfant non scolarisé"], [2, "Stucture conventionnée, enfant scolarisé"], [3, "Stucture non conventionnée, enfant non scolarisé"], [4, "Stucture non conventionnée, enfant scolarisé"]]} label="structure" onChange={this.handleFieldChange.bind(this,"structure")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="tarifhoraire" onChange={this.handleFieldChange.bind(this,"tarifhoraire")}  />
                </div>
                <div className="col-xs-12 col-sm-3">
                  <InputEuro label="tarifrepas" onChange={this.handleFieldChange.bind(this,"tarifrepas")}  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <button type="button" onClick={this.calculSalaireRerefence.bind(this)} className="btn btn-primary">Calcul</button>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  {this.state.tariffacture} €
                </div>
              </div>
              <div id="disqus_thread"></div>
            </div>
        )
    }
}
