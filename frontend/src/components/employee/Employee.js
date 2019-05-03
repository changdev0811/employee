import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getStatus, updateStatus } from '../../actions/statusAction';
import { getEmployee } from '../../actions/employeeAction';

class Employee extends Component {

    constructor() {
        super();
        
        this.state = {
            byname: '',
            bystatus: ''
        };
        this.updateStatus = this.updateStatus.bind(this); // optional
        this.onNameChange = this.onNameChange.bind(this); // optional
        this.onStatusChange = this.onStatusChange.bind(this); // optional
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        this.props.getStatus(this.props.auth.user.email);
        this.props.getEmployee('', '');
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
    }

    updateStatus = event => {
        const { user } = this.props.auth;
        const email = user.email;
        const status = event.target.value;
        this.props.updateStatus(email, status);
    };

    onNameChange = event => {
        this.setState({byname: event.target.value});
    }

    onStatusChange = event => {
        this.setState({bystatus: event.target.value});
    }

    handleFilter(event){
        event.preventDefault();
        this.props.getEmployee(this.state.byname, this.state.bystatus);
    }
    render(){
        const { user } = this.props.auth;
        const { status } = this.props.status;
        const email = user.email;
        const username   = email.substring(0, email.lastIndexOf("@"));
        const { employees } = this.props.employees;
        return(
            <div className="container">
                <div className="row mb-3 mt-3">
                    <div className="col-md-8 m-auto">
                        <p className="lead text-center">
                        Hello {username}, you are on {status}.
                        </p>
                    </div>
                </div>
                
                <div className="row mb-3">
                    <div className="col-md-8 m-auto">
                        <p className="lead text-left">
                            Update My Current Status:
                        </p>
                        <select className="form-control col-md-6" onChange={this.updateStatus} value={status}>
                            <option value="Working">Working</option>
                            <option value="Vacation">Vacation</option>
                            <option value="LunchTime">LunchTime</option>
                            <option value="BusinessTrip">BusinessTrip</option>
                        </select>
                    </div>
                </div>
                <hr className="col-md-8 m-auto"></hr>
                <div className="row mt-4 mb-3">
                    <div className="col-md-8 m-auto">
                        <p className="lead text-left">
                            List of employees:
                        </p>
                        <form className="form-inline">
                            <div className="form-group col-md-4">
                                <input
                                    className="form-control col-md-12"
                                    placeholder="Search by name..."
                                    type="text"
                                    value={this.state.byname}
                                    onChange={this.onNameChange}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <select className="form-control col-md-12" value={this.state.bystatus} onChange={this.onStatusChange}>
                                    <option value="">Filter By Status...</option>
                                    <option value="Working">Working</option>
                                    <option value="Vacation">Vacation</option>
                                    <option value="LunchTime">LunchTime</option>
                                    <option value="BusinessTrip">BusinessTrip</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                            <button type="button" className="btn btn-primary col-md-12" onClick={this.handleFilter}>Filter</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 m-auto">
                        <ul className="list-group">
                            {employees.map((row, index )=> {
                                const username = row.email.substring(0, row.email.lastIndexOf("@"));
                                
                                if(row.email === email){
                                    return false;
                                }
                                if(row.status === 'Vacation'){
                                    return(
                                        <li key={index} className="list-group-item text-left" style={{background: 'red'}}>{ username } ({row.status})</li>
                                        )
                                }
                                return(
                                <li key={index} className="list-group-item text-left">{ username } ({row.status})</li>
                                )
                            }
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

Employee.propTypes = {
    auth: PropTypes.object.isRequired,
    getStatus: PropTypes.func.isRequired,
    updateStatus: PropTypes.func.isRequired,
    getEmployee: PropTypes.func.isRequired,
  };

const mapStateToProps = state => ({
    auth: state.auth,
    employees: state.employees,
    status: state.status
});

export default connect(mapStateToProps, {getStatus, updateStatus, getEmployee})(Employee);