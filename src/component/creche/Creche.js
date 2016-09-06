import React, {Component, PropTypes} from 'react';
import InputDate from '../../framework/components/form/InputDate.jsx'
import InputText from '../../framework/components/form/InputText.jsx'
import {FormattedMessage} from 'react-intl';

const SSM = 1922.96

export default class Creche extends Component {

    state = {
      salairereference:0,
      categoriesalaire:0,
      values : {}
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
      this.setState({salairereference:salairereference,categoriesalaire:categoriesalaire})
    }

    conversionInput(value) {
      return value ? parseFloat(value) : 0
    }

    render() {
        return (
            <div>
                <h1>Creche</h1>
                <h2>Salaire de référence</h2>
                <div className="row">
                  <div className="col-xs-6">
                    <h3>3 dernières fiches de paye</h3>
                    <div className="col-xs-6">
                      <InputText label="salaireM11" onChange={this.handleFieldChange.bind(this,"salaireM11")}  />
                      <InputText label="salaireM12" onChange={this.handleFieldChange.bind(this,"salaireM12")}  />
                      <InputText label="salaireM13" onChange={this.handleFieldChange.bind(this,"salaireM13")}  />
                    </div>
                    <div className="col-xs-6">
                      <InputText label="salaireM21" onChange={this.handleFieldChange.bind(this,"salaireM21")}  />
                      <InputText label="salaireM22" onChange={this.handleFieldChange.bind(this,"salaireM22")}  />
                      <InputText label="salaireM23" onChange={this.handleFieldChange.bind(this,"salaireM23")}  />
                    </div>
                  </div>
                  <div className="col-xs-6">
                    <h3>Salaire imposable annuelle</h3>
                    <InputText label="salaireA1" onChange={this.handleFieldChange.bind(this,"salaireA1")}  />
                    <InputText label="salaireA2" onChange={this.handleFieldChange.bind(this,"salaireA2")}  />
                  </div>
                  <div className="row">
                    <div className="col-xs-12">
                      <button type="button" onClick={this.calculSalaireRerefence.bind(this)} className="btn btn-primary">Calcul salaire de référence</button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12">
                      {this.state.salairereference} €
                      categorie : {this.state.categoriesalaire}
                    </div>
                  </div>
                </div>

            </div>
        )
    }
}

Creche.propTypes = {

}
