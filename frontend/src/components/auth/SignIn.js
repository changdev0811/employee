import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { login } from '../../actions/authAction';

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/employee');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/employee');
    }
  }

  onChange = event => {
    const state = this.state;
    state[event.target.name] = event.target.value;
    this.setState(state);
  };

  onLogin = event => {
    event.preventDefault();
    const { email } = this.state;
    this.props.login(email)
  }
  
  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row mt-5 mb-5">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center mb-5">Welcome to MyWorkStatus</h1>
              
              <form onSubmit={this.onLogin} className="form-inline">
                <div className="form-group col-md-8">
                  <input
                    className="form-control col-md-12"
                    placeholder="My Username"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group col-md-4">
                  <button type="submit" className="btn btn-primary col-md-12">Login</button>
                </div>
                
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignIn.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
});

// export default withStyles(styles)(SignIn);
export default connect(mapStateToProps, { login })(SignIn);
