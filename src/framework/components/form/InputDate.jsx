import React, {Component} from 'react';
import BootstrapDatePicker from 'bootstrap-datepicker'
import BootstrapDatePickerCss from 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.css'
import $ from 'jquery'

export default class InputDate extends Component {
    state = {
        classError: "form-group"
    }

    componentDidMount() {
        $(this.refs.inputDate).datepicker().on('changeDate', (e) => {
            this.handleChange(e);
        });
        this.setState({
            classError: this.props.error ? "form-group has-error" : "form-group",
        })
    }

    handleChange(event) {
        this.props.onChange(this.props.id, event.target.value);
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
                    <div className="input-group-addon"><span className="glyphicon glyphicon-calendar" aria-hidden="true"></span></div>
                    <input placeholder={this.props.label} ref="inputDate" type="text" className="form-control" id={this.props.id} name={this.props.id} value={this.props.value} data-provide="datepicker" data-date-language=""/>
                </div>
                {this.props.error ?
                  <span className="help-block">{this.props.error}</span>
                    : []
                }
            </div>
        )
    }
}

InputDate.propTypes = {
    id: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    error:React.PropTypes.string,
    onChange:React.PropTypes.func
};
