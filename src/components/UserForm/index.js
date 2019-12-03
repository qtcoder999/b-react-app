import React, { Component } from "react";
import "./UserForm.css";
// API
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMinusCircle
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import SHA1 from "crypto-js/sha1";
import logo from "../../assets/gsuite-2x.png";
// import Loader from "react-loader-spinner";

export default class UserForm extends Component {
  constructor(props) {
    super(props);
    this.isAnyFieldEmpty = false;
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = this.initialState;
  }

  get initialState() {
    return {
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
        emailID: "",
        username: "",
        password: "",
        confirmPassword: "",
        numberOfSeats: "",
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

  componentDidMount() {
    let newState = JSON.parse(window.sessionStorage.getItem("state"));
    // debugger;
    newState
      ? newState.hasVerified
        ? (newState.hasVerified = false)
        : null
      : null;

    newState
      ? newState.isFormSubmitting
        ? (newState.isFormSubmitting = false)
        : null
      : null;

    this.setState(newState);
  }

  process = (key, value) => {
    if (value == "" || value == undefined) {
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

  makeAPIObject(localObject) {
    let newObject = {
      firstName: localObject.firstName,
      lastName: localObject.lastName,
      phoneNumber: localObject.phoneNumber,
      customerPartyAccountId: localObject.customerPartyAccountID,
      customerPartyAccountName: localObject.customerPartyAccountName,
      organizationName: localObject.organizationName.organizationName,
      emailId: localObject.emailID,
      domain: localObject.domain,
      companyAddress: localObject.contactName,
      userName: localObject.username,
      password: localObject.password,
      addressLine1: localObject.addressLine1,
      addressLine2: localObject.addressLine2,
      city: localObject.city,
      state: localObject.state,
      country: localObject.country,
      zipCode: localObject.postalCode
    };
    return newObject;
  }

  handleSubmit = event => {
    let postObject = null;
    event.preventDefault();
    this.isAnyFieldEmpty = false;
    this.traverse(
      { ...this.state.companyInfo, ...this.state.userDetails },
      this.process
    );

    this.setState({
      companyInfo: JSON.parse(
        JSON.stringify(this.state.companyInfo).replace(/"\s+|\s+"/g, '"')
      )
    });
    this.setState({
      userDetails: JSON.parse(
        JSON.stringify(this.state.userDetails).replace(/"\s+|\s+"/g, '"')
      )
    });

    const { password, confirmPassword } = this.state.companyInfo;

    if (password !== confirmPassword) {
      this.isAnyFieldEmpty = true;
      alert("Passwords don't match.");
    } else if (!this.state.hasVerified) {
      this.isAnyFieldEmpty = true;
      alert("Please verify the domain.");
    } else if (this.isAnyFieldEmpty) {
      alert("Error. Please check the data.");
    }

    if (!this.isAnyFieldEmpty && this.state.hasVerified) {
      this.setState({ isFormSubmitting: true });
      const newState = JSON.parse(JSON.stringify(this.state));
      const { companyInfo } = newState;

      delete companyInfo.confirmPassword;
      companyInfo.password = SHA1(companyInfo.password).toString();

      let postObject = this.makeAPIObject(this.state.companyInfo);

      console.log("postObject ", postObject);

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

    const { domain } = this.state.companyInfo;
    // console.log("domain ", domain);
    this.setState({ isVerifying: true });

    let headers = {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*"
    };

    axios
      .get(`http://localhost:3000/provisionManager/customer/GSUITE/` + domain + "", {
        headers
      })
      .then(response => {
        // console.log(response);
        // debugger;
        if (response.data == "") {
          // alert("Domain not available.");
          this.setState({ hasVerified: true });
        } else {
          alert("Requested domain is not available.");

          this.setState({ hasVerified: false });
        }
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
    event !== undefined ? event.preventDefault() : null;

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

  handleRemove = (index, event) => {
    event !== undefined ? event.preventDefault() : null;

    console.log("Log index", index);

    let userDetails = [...this.state.userDetails]; // make a separate copy of the array
    userDetails.splice(index, 1);
    this.setState({ userDetails }, () => {
      if (userDetails.length === 0) {
        this.handleAdd();
      }
    });
  };

  handleClearAllFields = () => {
    if (window.confirm("Are you sure ?")) {
      this.setState(this.initialState);
    } else {
      // Do nothing!
    }
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
        <FontAwesomeIcon
          icon={faMinusCircle}
          onClick={this.handleRemove.bind(this, index)}
          color="#e40000"
        />
        <br />
      </div>
    ));
  }

  // static getDerivedStateFromProps(props, state) {
  //   console.clear();
  //   console.log(JSON.stringify(state, null, 2));
  //   return null;
  // }
  componentDidUpdate() {
    let newState = { ...this.state };
    delete newState.companyInfo.password;
    delete newState.companyInfo.confirmPassword;
    window.sessionStorage.setItem("state", JSON.stringify(newState));
  }
  render() {
    const { companyInfo, hasVerified, isVerifying } = this.state;
    return (
      <div>
        <div className="headingContainer">
          <header className="heading-box">
            <span className="logo-box">
              <img className="logo" src={logo} alt="logo" />
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
              <label>Customer Party Account Name</label>
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
              <label>Customer Party Account ID</label>
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
              <label>Customer Domain</label>
              {this.state.hasVerified ? (
                <input
                  className="domain halfWidth inputDisabled"
                  type="text"
                  id="domain"
                  name="domain"
                  placeholder="Enter your organisation’s domain"
                  value={companyInfo.domain}
                  onChange={this.handleChange}
                  required
                  readOnly
                />
              ) : (
                <input
                  className="domain halfWidth"
                  type="text"
                  id="domain"
                  name="domain"
                  placeholder="Enter your organisation’s domain"
                  value={companyInfo.domain}
                  onChange={this.handleChange}
                  required
                />
              )}

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
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <FontAwesomeIcon icon={faCheckCircle} color="green" />{" "}
                  <button
                    type="button"
                    className="addButton"
                    onClick={() => this.setState({ hasVerified: false })}
                    value="Cancel"
                  >
                    Cancel
                  </button>
                </React.Fragment>
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
              <label>Email ID</label>
              <input
                type="text"
                id="lname"
                name="emailID"
                value={companyInfo.emailID}
                placeholder="Enter email address that's not in above entered domain"
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
                    className="oneThirdWidth mr0"
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
                    type="number"
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
              <span className="domain-name">
                {hasVerified && companyInfo.domain
                  ? " @" + companyInfo.domain
                  : null}
              </span>
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
              <label>Number Of Seats</label>
              <input
                type="number"
                className="halfWidth"
                id="numberOfSeats"
                name="numberOfSeats"
                value={companyInfo.numberOfSeats}
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
            {/* <button
              type="button"
              className="addNew"
              onClick={
                this.state.userDetails.length > 1 ? this.handleRemove : null
              }
            >
              Remove
            </button> */}
            <br />
            <span className="actionButtons">
              <input
                className="submitBtn"
                type="submit"
                defaultValue="Submit"
                onClick={
                  !this.state.isFormSubmitting ? this.handleSubmit : null
                }
              />
              <button
                type="button"
                className="submitBtn"
                onClick={this.handleClearAllFields}
                value="Clear all fields"
              >
                Clear all fields
              </button>
            </span>
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
