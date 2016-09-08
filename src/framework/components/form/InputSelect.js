import React, {Component} from 'react';

export default class InputSelect extends Component {
    state = {
        classError: "form-group"
    }

    componentDidMount() {
        this.setState({
            classError: this.props.error ? "form-group has-error" : "form-group",
        })
    }

    handleChange(event) {
        this.props.onChange(event.target.value);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            classError: nextProps.error ? "form-group has-error" : "form-group",
        })
    }

    render() {
        return (
            <div className={this.state.classError}>
              <label>{this.props.label}</label>
                  <select className="form-control input-sm" onChange={this.handleChange.bind(this)}>
                    <option></option>
                      {this.props.values.map((value) =>
                        <option key={value[0]} value={value[0]}>{value[1]}</option>
                      )}
                  </select>
                  {this.props.error ?
                    <span className="help-block">{this.props.error}</span>
                      : []
                  }
            </div>
        )
    }
}

InputSelect.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    values: React.PropTypes.array.isRequired,
    error:React.PropTypes.string,
};
