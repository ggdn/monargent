import React, {Component} from 'react';

export default class InputNb extends Component {
    state = {
        classError: "form-group"
    }

    componentDidMount() {
        this.setState({
            classError: this.props.error ? "form-group has-error" : "form-group",
        })
    }

    handleChange(event) {
        this.props.onChange(event.target.value ? parseInt(event.target.value) : 0);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            classError: nextProps.error ? "form-group has-error" : "form-group",
        })
    }

    render() {
        return (
            <div className={this.state.classError}>
                  <input placeholder={this.props.label} type="number" onChange={this.handleChange.bind(this)} className="form-control input-sm" value={this.props.value}/>
                    {this.props.error ?
                      <span className="help-block">{this.props.error}</span>
                        : []
                    }
            </div>
        )
    }
}

InputNb.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    error:React.PropTypes.string
};
