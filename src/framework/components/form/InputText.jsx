import React, {Component} from 'react';

export default class InputText extends Component {
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
                <input placeholder={this.props.label} type="text" onChange={this.handleChange.bind(this)} className="form-control" value={this.props.value}/>
                  {this.props.error ?
                    <span className="help-block">{this.props.error}</span>
                      : []
                  }
            </div>
        )
    }
}

InputText.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    error:React.PropTypes.string,
};
