import React, {Component} from 'react';

export default class InputEuro extends Component {
    state = {
        classError: "form-group"
    }

    componentDidMount() {
        this.setState({
            classError: this.props.error ? "form-group has-error" : "form-group",
        })
    }

    handleChange(event) {
        this.props.onChange(event.target.value ? parseFloat(event.target.value) : 0);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            classError: nextProps.error ? "form-group has-error" : "form-group",
        })
    }

    render() {
        return (
            <div className={this.state.classError}>
                <div className="input-group">
                  <div className="input-group-addon">€</div>
                  <input placeholder={this.props.label} type="number" step="0.01" onChange={this.handleChange.bind(this)} className="form-control input-sm" value={this.props.value}/>
                </div>
                {this.props.error ?
                  <span className="help-block">{this.props.error}</span>
                    : []
                }
            </div>
        )
    }
}

InputEuro.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    error:React.PropTypes.string,
};
