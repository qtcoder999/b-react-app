import React, { Component } from "react";
import "./UserForm.css";
// API
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import SHA1 from "crypto-js/sha1";

// import Loader from "react-loader-spinner";

export default class UserForm extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   companyInfo: {
    //     domain: "parasTesting.com",
    //     organizationName: "Airtel Enterprises",
    //     contactName: "Bharti Airtel Pvt. Ltd.",
    //     addressLine1: "Plot No. 16",
    //     addressLine2: "Udyog Vihar",
    //     country: "IN",
    //     region: "Delhi",
    //     city: "New Delhi",
    //     postalCode: "110063",
    //     firstName: "Bharti Airtel",
    //     lastName: "Ltd.",
    //     phoneNumber: "9818156333",
    //     alternateEmail: "paras@unifytech.com",
    //     username: "testparas",
    //     password: "",
    //     confirmPassword: "",
    //     customerPartyAccountName: "Paras Anand",
    //     customerPartyAccountID: "12123123"
    //   },
    //   userDetails: [
    //     {
    //       billableID: "paras@unify.com",
    //       billablePhoneNumber: "09818156333",
    //       planID: "paras@unify.com",
    //       cirlce: "paras@unify.com",
    //       billablefirstName: "paras@unify.com",
    //       billableLastName: "paras@unify.com",
    //       billableEmailID: "paras@unify.com"
    //     }
    //   ],
    //   isFormSubmitting: false,
    //   isVerifying: false,
    //   hasVerified: false
    // };
    this.isAnyFieldEmpty = false;
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      companyInfo: {
        domain: "",
        organizationName: "",
        contactName: "",
        addressLine1: "",
        addressLine2: "",
        country: "IN",
        region: "",
        city: "",
        postalCode: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        alternateEmail: "",
        username: "",
        password: "",
        confirmPassword: "",
        customerPartyAccountName: "",
        customerPartyAccountID: ""
      },
      userDetails: [
        {
          billableID: "",
          billablePhoneNumber: "",
          planID: "",
          cirlce: "",
          billablefirstName: "",
          billableLastName: "",
          billableEmailID: ""
        }
      ],
      isFormSubmitting: false,
      isVerifying: false,
      hasVerified: false
    };
  }

  process = (key, value) => {
    if (value == "") {
      this.isAnyFieldEmpty = true;
      // alert(key + "field is empty.");
      // console.log(key + " : " + value + "is blank");
    }
  };

  traverse = (o, func) => {
    for (var i in o) {
      func.apply(this, [i, o[i]]);
      if (o[i] !== null && typeof o[i] == "object") {
        this.traverse(o[i], func);
      }
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    // console.log("this.isAnyFieldEmpty", this.isAnyFieldEmpty);
    this.isAnyFieldEmpty = false;
    this.traverse(
      { ...this.state.companyInfo, ...this.state.userDetails },
      this.process
    );

    const { password, confirmPassword } = this.state.companyInfo;

    if (password !== confirmPassword) {
      this.isAnyFieldEmpty = true;
      alert("Passwords don't match.");
    } else if (!this.state.hasVerified) {
      this.isAnyFieldEmpty = true;
      alert("Domain not verified.");
    }
    // console.log("this.isAnyFieldEmpty", this.isAnyFieldEmpty);

    if (!this.isAnyFieldEmpty && this.state.hasVerified) {
      this.setState({ isFormSubmitting: true });
      const newState = JSON.parse(JSON.stringify(this.state));
      const { companyInfo } = newState;

      delete companyInfo.confirmPassword;
      companyInfo.password = SHA1(companyInfo.password).toString();

      axios
        .post(`http://demo0073795.mockable.io/formData`, {
          ...newState.companyInfo,
          ...newState.userDetails
        })
        .then(response => {
          alert("Message from server: " + response.data.message);
        })
        .catch(error => {
          console.log(error);
          alert("Submission unsuccessful.");
        })
        .finally(() => {
          this.setState({ isFormSubmitting: false });
        });
    } else {
      alert("Error. Please check the data.");
    }
  };

  handleBillableFormChange = (index, event) => {
    event.preventDefault();

    const name = event.target.name;
    const value = event.target.value;
    let userDetails = [...this.state.userDetails];
    userDetails[index] = { ...userDetails[index], [name]: value };
    this.setState({
      userDetails: [...userDetails]
    });
  };

  handleChange = event => {
    event.preventDefault();

    const name = event.target.name;
    const value = event.target.value;

    this.setState(prevState => {
      return {
        companyInfo: {
          ...prevState.companyInfo,
          [name]: value
        }
      };
    });
  };

  handleCheckDomain = event => {
    event.preventDefault();

    const { domain } = this.state;
    this.setState({ isVerifying: true });
    axios
      .post(`http://demo0073795.mockable.io/verificationStatus`, {
        domain
      })
      .then(response => {
        this.setState({ hasVerified: true });
        // alert("Message from server: " + response.data.verificationStatus);
      })
      .catch(error => {
        this.setState({ hasVerified: false });
        console.log(error);
        alert("Verification unsuccessful");
      })
      .finally(() => {
        this.setState({ isVerifying: false });
      });
  };

  handleAdd = event => {
    event.preventDefault();

    const newUserDetails = {
      billableID: "",
      billablePhoneNumber: "",
      planID: "",
      cirlce: "",
      billablefirstName: "",
      billableLastName: "",
      billableEmailID: ""
    };
    // alert("Call Verification API");
    this.setState(prevState => {
      return {
        userDetails: [...prevState.userDetails, { ...newUserDetails }]
      };
    });
  };

  handleRemove = event => {
    event.preventDefault();

    let userDetails = [...this.state.userDetails]; // make a separate copy of the array
    userDetails.splice(-1, 1);
    this.setState({ userDetails });
  };

  renderDynamicFormFields() {
    // debugger;
    const { userDetails } = this.state;
    return this.state.userDetails.map((item, index) => (
      <div className="customer" key={index}>
        <input
          className="billable-id"
          name="billableID"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].billableID : ""}
          type="text"
          required
        />
        <input
          className="phone-number"
          name="billablePhoneNumber"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={
            userDetails[index] ? userDetails[index].billablePhoneNumber : ""
          }
          type="tel"
          required
        />
        <input
          className="plan-id"
          name="planID"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].planID : ""}
          type="text"
          required
        />
        <input
          className="cirlce"
          name="cirlce"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].cirlce : ""}
          type="text"
          required
        />
        <input
          className="first-name"
          name="billablefirstName"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].billablefirstName : ""}
          type="text"
          required
        />
        <input
          className="last-name"
          name="billableLastName"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].billableLastName : ""}
          type="text"
          required
        />
        <input
          className="email-id"
          name="billableEmailID"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].billableEmailID : ""}
          type="text"
          required
        />
        <br />
      </div>
    ));
  }

  static getDerivedStateFromProps(props, state) {
    console.clear();
    console.log(JSON.stringify(state, null, 2));
    return null;
  }

  render() {
    const { companyInfo, hasVerified, isVerifying } = this.state;
    return (
      <div>
        <div className="headingContainer">
          <header className="heading-box">
            <span className="logo-box">
              <img
                className="logo"
                src="https://assets.cloud.im/prod/ux1/images/logos/gsuite/gsuite-2x.png"
              />
            </span>
            <span className="heading-info-box">
              <h1 className="first-heading">
                Please submit the following details
              </h1>
              <h2 className="second-heading">
                Need support? Call us XXX XXXXXXX
              </h2>
            </span>
          </header>
        </div>
        <div className="container">
          <div className="sub-container">
            <form>
              <label>Customer party account name</label>
              <input
                type="text"
                id="customerPartyAccountName"
                name="customerPartyAccountName"
                placeholder="Enter your customer party account name"
                value={companyInfo.customerPartyAccountName}
                onChange={this.handleChange}
                required
              />
              <br />
              <label>Customer party account ID</label>
              <input
                type="text"
                id="customerPartyAccountID"
                name="customerPartyAccountID"
                placeholder="Enter your customer party account ID"
                value={companyInfo.customerPartyAccountID}
                onChange={this.handleChange}
                required
              />
              <br />
              <label>Domain</label>
              <input
                className="halfWidth"
                type="text"
                id="domain"
                name="domain"
                placeholder="Enter your organisation’s domain"
                value={companyInfo.domain}
                onChange={this.handleChange}
                required
              />
              {!hasVerified ? (
                <React.Fragment>
                  <button
                    type="button"
                    className="addButton"
                    onClick={isVerifying ? null : this.handleCheckDomain}
                    value="Check"
                  >
                    Check
                  </button>
                  {/* <button
                    type="button"
                    onClick={isVerifying ? null : this.handleCheckDomain}
                    value="Add"
                  >
                    Cancel
                  </button> */}
                </React.Fragment>
              ) : (
                <FontAwesomeIcon icon={faCheckCircle} />
              )}

              <br />
              <label>Organization Name</label>
              <input
                type="text"
                id="orgname"
                name="organizationName"
                value={companyInfo.organizationName}
                onChange={this.handleChange}
                required
              />
              <br />
              <div className="separatingMargin">
                <label>Company Address</label>
                <span className="companyAddressBox">
                  <input
                    type="text"
                    id="companyaddr"
                    name="contactName"
                    placeholder="Contact Name"
                    value={companyInfo.contactName}
                    onChange={this.handleChange}
                    required
                  />
                  <br />
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    placeholder="Street Address Line 1"
                    value={companyInfo.addressLine1}
                    onChange={this.handleChange}
                    required
                  />
                  <br />
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    placeholder="Street Address Line 2"
                    value={companyInfo.addressLine2}
                    onChange={this.handleChange}
                    required
                  />
                  {/* <input
                    type="text"
                    id="addressLine3"
                    name="addressLine3"
                    placeholder="Street Address Line 3"
                    onChange={this.handleChange}
                  /> */}
                  <br />
                  <select
                    className="oneThirdWidth"
                    id="country"
                    name="country"
                    onChange={this.handleChange}
                    value={companyInfo.country}
                    required
                  >
                    <option value="IN">India</option>
                    <option value="AUS">Australia</option>
                    <option value="CN">Canada</option>
                    <option value="US">USA</option>
                  </select>
                  <input
                    className="oneThirdWidth"
                    type="text"
                    id="region"
                    name="region"
                    placeholder="Enter State"
                    value={companyInfo.region}
                    onChange={this.handleChange}
                    required
                  />
                  <input
                    className="oneThirdWidth"
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter City"
                    value={companyInfo.city}
                    onChange={this.handleChange}
                    required
                  />
                  <input
                    type="number"
                    className="halfWidth"
                    id="postalCode"
                    name="postalCode"
                    placeholder="Enter Pin Code"
                    value={companyInfo.postalCode}
                    onChange={this.handleChange}
                    required
                  />
                  <input
                    type="tel"
                    className="halfWidth"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter Phone Number"
                    value={companyInfo.phoneNumber}
                    onChange={this.handleChange}
                    required
                  />
                  <br />
                </span>
                <br />
              </div>
              <label>Primary Admin Name</label>
              <input
                className="halfWidth"
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={companyInfo.firstName}
                onChange={this.handleChange}
                required
              />
              <input
                className="halfWidth"
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={companyInfo.lastName}
                onChange={this.handleChange}
                required
              />
              <br />
              <label>Admin Username</label>
              <input
                type="text"
                className="halfWidth"
                id="username"
                name="username"
                value={companyInfo.username}
                onChange={this.handleChange}
                required
              />
              <span className="domain-name"> @{companyInfo.domain} </span>
              <br />
              <label>Admin Password</label>
              <input
                type="password"
                className="halfWidth"
                id="password"
                name="password"
                value={companyInfo.password}
                onChange={this.handleChange}
                required
              />
              <br />
              <label>Admin Confirm Password</label>
              <input
                type="password"
                className="halfWidth"
                id="confirmPassword"
                name="confirmPassword"
                value={companyInfo.confirmPassword}
                onChange={this.handleChange}
                required
              />
              <br />
              <label>Alternate Email</label>
              <input
                type="text"
                id="lname"
                name="alternateEmail"
                value={companyInfo.alternateEmail}
                placeholder="Enter email address that's not in above entered domain"
                onChange={this.handleChange}
                required
              />
              <br />
              {/* <label>(All fields are mandatory)</label> */}
            </form>
          </div>
        </div>
        <div className="container">
          <div className="sub-container customer ">
            <div className="customer-heading">
              <span className="billable-id">Billable ID</span>
              <span className="phone-number">Phone Number</span>
              <span className="plan-id">Plan ID</span>
              <span className="cirlce">Circle</span>
              <span className="first-name">First Name</span>
              <span className="last-name">Last Name</span>
              <span className="email-id">Email ID</span>
            </div>
            <form>{this.renderDynamicFormFields()}</form>
            <button type="button" className="addNew" onClick={this.handleAdd}>
              Add New
            </button>
            <button
              type="button"
              className="addNew"
              onClick={
                this.state.userDetails.length > 1 ? this.handleRemove : null
              }
            >
              Remove
            </button>
            <br />
            <input
              className="submitBtn"
              type="submit"
              defaultValue="Submit"
              onClick={!this.state.isFormSubmitting ? this.handleSubmit : null}
            />
            <br />
            {/* {this.state.isFormSubmitting ? (
              <Loader type="Puff" color="#00BFFF" height={50} width={50} />
            ) : null} */}
          </div>
        </div>
      </div>
    );
  }
}
