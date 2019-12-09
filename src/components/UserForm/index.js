/* eslint-disable eqeqeq */
import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faMinusCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import SHA1 from "crypto-js/sha1";
import logo from "../../assets/gsuite-2x.png";
import { checkIfDomainIsValid, submitOrder } from "../../api/http.service";

const STATIC_PHONE_NUMBER_PREFIX = "+91";

export default class UserForm extends Component {
  constructor(props) {
    super(props);
    this.fieldErrorFlag = false;
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
        addressLine3: "",
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
        adminPhoneNumber: "",
        numberOfSeats: "",
        customerPartyAccountName: "",
        customerPartyAccountID: ""
      },
      userDetails: [
        {
          billableID: "",
          billablePhoneNumber: "",
          // planID: "",
          cirlce: "",
          billableFirstName: "",
          billableLastName: "",
          billableEmailID: ""
        }
      ],
      isFormSubmitting: false,
      isVerifying: false,
      hasVerified: false,
      verificationError: false
    };
  }

  componentDidMount() {
    let newState = JSON.parse(window.sessionStorage.getItem("state"));

    if (newState && newState.hasVerified) {
      newState.hasVerified = false;
    }
    if (newState && newState.isFormSubmitting) {
      newState.isFormSubmitting = false;
    }
    if (newState && newState.verificationError) {
      newState.verificationError = false;
    }
    // newState.companyInfo.password = "";
    // newState.companyInfo.confirmPassword = "";

    this.setState(newState, this.populateDomainInRows);
  }

  componentDidUpdate(prevProps, prevState) {
    let newState = JSON.parse(JSON.stringify({ ...this.state }));

    // stop password to go into the sessionStorage due to security reasons
    newState.companyInfo.password = "";
    newState.companyInfo.confirmPassword = "";
    // newState.hasVerified = true;

    window.sessionStorage.setItem("state", JSON.stringify(newState));

    if (prevState.hasVerified != this.state.hasVerified) {
      this.populateDomainInRows();
    }
  }
  populateDomainInRows = () => {
    let {
      companyInfo: { domain, username },
      userDetails
    } = this.state;

    let newUserDetails = JSON.parse(JSON.stringify(userDetails));

    if (this.state.hasVerified) {
      newUserDetails = newUserDetails.map((item, index) => {
        if (index == 0) {
          return { ...item, billableEmailID: username + "@" + domain };
        } else {
          return { ...item, billableEmailID: "@" + domain };
        }
      });
    } else {
      newUserDetails = newUserDetails.map((item, index) => {
        return { ...item, billableEmailID: "" };
      });
    }

    this.setState({ userDetails: newUserDetails });
  };

  process = (key, value) => {
    if (value == "" || value == undefined) {
      this.fieldErrorFlag = true;
      // toast.error(key + "field is empty.");
      // console.log(key + " : " + value + "is blank");
    } else if (key === "billablePhoneNumber" && value.length !== 10) {
      toast.error("Admin Phone Number should be of 10 digists.");
      this.fieldErrorFlag = true;
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

  makeAPIObject(companyInfo, userDetails) {
    const _users = userDetails.map(item => {
      return {
        firstName: item.billableFirstName,
        lastName: item.billableLastName,
        emailId: item.billableEmailID,
        phoneNumber: STATIC_PHONE_NUMBER_PREFIX + item.billablePhoneNumber,
        circleId: item.cirlce
      };
    });

    let newObject = {
      customerPartyAccountId: companyInfo.customerPartyAccountID,
      customerPartyAccountName: companyInfo.customerPartyAccountName,
      organizationName: companyInfo.organizationName,
      mobileNumber: STATIC_PHONE_NUMBER_PREFIX + companyInfo.phoneNumber,
      emailId: companyInfo.alternateEmail,
      domain: companyInfo.domain,
      companyAddress: {
        addressLine1: companyInfo.addressLine1,
        addressLine2: companyInfo.addressLine2,
        // addressLine3: companyInfo.addressLine3
        city: companyInfo.city,
        state: companyInfo.region,
        countryCode: companyInfo.country,
        zipCode: companyInfo.postalCode
      },
      billableAccounts: [
        {
          billableId: userDetails[0].billableID,
          emailId: companyInfo.username + "@" + companyInfo.domain,
          users: _users
        }
      ],

      serviceDetail: {
        productId: "PRD_12254",
        serviceName: "GSUITE",
        serviceType: "SAAS",
        numberOfSeats: companyInfo.numberOfSeats,
        planDetail: {
          id: "planId1",
          name: "Free-Guite",
          priceDetail: {
            actualPrice: 799,
            finalPrice: 799,
            frequency: "yearly"
          },
          externalSubscriptionInfo: {
            skuId: "Google-Apps-For-Business",
            planName: "FLEXIBLE",
            renewalType: "RENEW_CURRENT_USERS_MONTHLY_PAY"
          }
        }
      },
      adminDetail: {
        firstName: companyInfo.firstName,
        lastName: companyInfo.lastName,
        phoneNumber: STATIC_PHONE_NUMBER_PREFIX + companyInfo.adminPhoneNumber,
        userName: companyInfo.username + "@" + companyInfo.domain,
        password: companyInfo.password,
        hashFunction: "SHA-1"
      },
      action: "CREATE"
      // contactName: companyInfo.contactName,
    };
    return newObject;
  }

  handleSubmit = event => {
    // eslint-disable-next-line no-unused-vars
    event.preventDefault();
    let postObject = null;
    const {
      companyInfo: { adminPhoneNumber }
    } = this.state;
    this.fieldErrorFlag = false;
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

    const { password, confirmPassword, phoneNumber } = this.state.companyInfo;

    if (password !== confirmPassword) {
      this.fieldErrorFlag = true;
      toast.error("Passwords don't match.");
    } else if (!this.state.hasVerified) {
      this.fieldErrorFlag = true;
      toast.error("Please verify the domain.");
    } else if (this.fieldErrorFlag) {
      toast.error("Error. Please check the data.");
    } else if (password.length <= 8) {
      toast.error("Password should be of at least 8 characters.");
      this.fieldErrorFlag = true;
    } else if (adminPhoneNumber.length != 10 || phoneNumber.length != 10) {
      this.fieldErrorFlag = true;
      toast.error("Phone number should be of 10 digits.");
    }
    if (!this.fieldErrorFlag && this.state.hasVerified) {
      this.setState({ isFormSubmitting: true });

      // make newState to delete confirm password key
      const newState = JSON.parse(JSON.stringify(this.state));
      const { companyInfo } = newState;

      delete companyInfo.confirmPassword;

      companyInfo.password = SHA1(companyInfo.password).toString();

      let postObject = this.makeAPIObject(
        newState.companyInfo,
        newState.userDetails
      );

      console.log(SHA1(companyInfo.password).toString());
      console.log("postObject ", postObject);

      submitOrder({ ...postObject })
        .then(response => {
          if (response.status == 200) {
            let { orderStatusDetail, orderDetail } = response.data;
            console.log("OrderId: " + orderDetail.orderId);
            if (orderStatusDetail) {
              if (
                orderStatusDetail.orderStatus === "IN_PROGRESS" &&
                orderStatusDetail.orderEvent === "PROVISION_SUBSCRIPTION"
              ) {
                toast.success("Successfully submitted on server.");
              }
            }
          }

          this.setState({ hasVerified: false });
        })
        .catch(error => {
          if (error) {
            if (error.response.data.message) {
              toast.error(
                "Message from server: " +
                  error.response.data.code +
                  " - " +
                  error.response.data.message
              );
            }
          }

          console.log(error);
          toast.error("Submission unsuccessful.");
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

    // if (billablePhoneNumber.length === 10) {
    //   this.fieldErrorFlag = false;
    // }
    // else{
    //   this.fieldErrorFlag = true;

    // }
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
    }, this.handleExtraChanges.bind(this, name, value));
  };
  handleExtraChanges(name, value) {
    if (name === "numberOfSeats") {
      this.manageRows();
    } else if (
      name === "firstName" ||
      "lastName" ||
      "username" ||
      "adminPhoneNumber"
    ) {
      this.autoPopulateAdminDetails(name, value);
    }
  }

  autoPopulateAdminDetails = (name, value) => {
    let { userDetails } = this.state;

    let userDetailsTemp = JSON.parse(JSON.stringify(userDetails));

    if (name === "firstName") {
      userDetailsTemp[0].billableFirstName = value;
    } else if (name === "lastName") {
      userDetailsTemp[0].billableLastName = value;
    } else if (name === "username") {
      if (this.state.hasVerified) {
        const {
          companyInfo: { domain }
        } = this.state;
        userDetailsTemp[0].billableEmailID = value + "@" + domain;
      } else {
        userDetailsTemp[0].billableEmailID = "";
      }
    } else if (name === "adminPhoneNumber") {
      userDetailsTemp[0].billablePhoneNumber = value;
    }

    this.setState({ userDetails: userDetailsTemp });
  };

  manageRows = () => {
    let {
      userDetails,
      companyInfo: { numberOfSeats }
    } = this.state;

    if (
      numberOfSeats >= 1 &&
      this.state.userDetails.length >= this.state.companyInfo.numberOfSeats
    ) {
      let userDetailsTemp = JSON.parse(JSON.stringify(userDetails));

      userDetailsTemp.splice(
        numberOfSeats,
        userDetailsTemp.length - numberOfSeats
      );

      this.setState({ userDetails: userDetailsTemp });
    }
  };

  handleCheckDomain = event => {
    event.preventDefault();
    const { domain } = this.state.companyInfo;
    this.setState({ isVerifying: true });

    checkIfDomainIsValid(domain)
      .then(response => {
        if (response.data == "") {
          this.setState({ hasVerified: true });
        } else {
          toast.error("Requested domain is not available.");

          this.setState({ hasVerified: false, verificationError: true });
        }
      })
      .catch(error => {
        this.setState({ hasVerified: false, verificationError: true });
        console.log(error);
        toast.error("Verification was unsuccessful.");
      })
      .finally(() => {
        this.setState({ isVerifying: false });
      });
  };

  handleAdd = event => {
    if (event !== undefined) {
      event.preventDefault();
    }
    const {
      companyInfo: { numberOfSeats }
    } = this.state;

    if (this.state.userDetails.length < numberOfSeats) {
      const {
        hasVerified,
        companyInfo: { domain }
      } = this.state;

      const newUserDetails = {
        billableID: "",
        billablePhoneNumber: "",
        // planID: "",
        cirlce: "",
        billableFirstName: "",
        billableLastName: "",
        billableEmailID: hasVerified && domain ? " @" + domain : null
      };

      this.setState(prevState => {
        return {
          userDetails: [...prevState.userDetails, { ...newUserDetails }]
        };
      });
    } else if (numberOfSeats == "") {
      toast.error("Please fill the number of seats to add a new row.");
    } else if (
      numberOfSeats !== "" &&
      this.state.userDetails.length == numberOfSeats
    ) {
      toast.error("Please increase the number of seats to add a new row.");
    }
  };

  handleRemove = (index, event) => {
    if (event !== undefined) {
      event.preventDefault();
    }

    let userDetails = [...this.state.userDetails];
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
    const { userDetails } = this.state;

    return this.state.userDetails.map((item, index) => (
      <div className="customer" key={index}>
        <input
          className="billableId"
          name="billableID"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].billableID : ""}
          type="text"
          required
        />
        {/* <input
          className="planId"
          name="planID"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].planID : ""}
          type="text"
          required
        /> */}
        <input
          className="cirlce"
          name="cirlce"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].cirlce : ""}
          type="text"
          required
        />
        <input
          className={"firstName " + (index == 0 ? "inputDisabled" : "")}
          name="billableFirstName"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].billableFirstName : ""}
          type="text"
          required
          disabled={index == 0}
        />
        <input
          className={"lastName " + (index == 0 ? "inputDisabled" : "")}
          name="billableLastName"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].billableLastName : ""}
          type="text"
          disabled={index == 0}
          required
        />
        <input
          className={"phoneNumber " + (index == 0 ? "inputDisabled" : "")}
          name="billablePhoneNumber"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={
            userDetails[index] ? userDetails[index].billablePhoneNumber : ""
          }
          type="tel"
          required
        />
        <input
          className={"emailId inputBox " + (index == 0 ? "inputDisabled" : "")}
          name="billableEmailID"
          onChange={this.handleBillableFormChange.bind(this, index)}
          value={userDetails[index] ? userDetails[index].billableEmailID : ""}
          type="text"
          disabled={index == 0}
          required
        />{" "}
        {index !== 0 ? (
          <FontAwesomeIcon
            icon={faMinusCircle}
            onClick={index !== 0 ? this.handleRemove.bind(this, index) : null}
            color="#e40000"
          />
        ) : null}
        <br />
      </div>
    ));
  }

  render() {
    const {
      companyInfo,
      hasVerified,
      isVerifying,
      verificationError
    } = this.state;
    return (
      <div>
        <ToastContainer
          className="toast-container"
          toastClassName="dark-toast"
        />
        <div className="headingContainer">
          <header className="headingBox">
            <span className="logoBox">
              <img className="logo" src={logo} alt="logo" />
            </span>
            <span className="headingInfoBox">
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
          <div className="subContainer">
            <form>
              <label>Customer Party Account Name</label>
              <input
                type="text"
                id="customerPartyAccountName"
                name="customerPartyAccountName"
                placeholder="Enter your customer party account name"
                value={companyInfo.customerPartyAccountName}
                onChange={this.handleChange}
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
              />
              <br />
              <label>Customer Domain</label>
              <input
                className={
                  "domain halfWidth " +
                  (this.state.hasVerified ? "inputDisabled" : "")
                }
                type="text"
                id="domain"
                name="domain"
                placeholder="Enter your organisation’s domain"
                value={companyInfo.domain}
                onChange={this.handleChange}
                disabled={this.state.hasVerified}
              />

              {!hasVerified ? (
                <React.Fragment>
                  {verificationError ? (
                    <span className="fontAwesomeIcon">
                      <FontAwesomeIcon icon={faTimesCircle} color="red" />
                    </span>
                  ) : null}
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
                  <span>
                    <FontAwesomeIcon icon={faCheckCircle} color="#228C22" />
                  </span>
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
              />
              <br />
              <label>Email ID</label>
              <input
                type="text"
                id="lname"
                name="alternateEmail"
                value={companyInfo.alternateEmail}
                placeholder="Enter email address that's not in above entered domain"
                onChange={this.handleChange}
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
                  />
                  <br />
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    placeholder="Street Address Line 1"
                    value={companyInfo.addressLine1}
                    onChange={this.handleChange}
                  />
                  <br />
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    placeholder="Street Address Line 2"
                    value={companyInfo.addressLine2}
                    onChange={this.handleChange}
                  />
                  <input
                    type="text"
                    id="addressLine3"
                    name="addressLine3"
                    placeholder="Street Address Line 3"
                    value={companyInfo.addressLine3}
                    onChange={this.handleChange}
                  />
                  <br />
                  <select
                    className="oneThirdWidth"
                    id="country"
                    name="country"
                    onChange={this.handleChange}
                    value={companyInfo.country}
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
                  />
                  <input
                    className="oneThirdWidth mr0"
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter City"
                    value={companyInfo.city}
                    onChange={this.handleChange}
                  />
                  <input
                    type="number"
                    className="halfWidth"
                    id="postalCode"
                    name="postalCode"
                    placeholder="Enter Pin Code"
                    value={companyInfo.postalCode}
                    onChange={this.handleChange}
                  />
                  <input
                    type="number"
                    className="halfWidth"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter Phone Number"
                    value={companyInfo.phoneNumber}
                    onChange={this.handleChange}
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
              />
              <input
                className="halfWidth"
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={companyInfo.lastName}
                onChange={this.handleChange}
              />
              <br />
              <label>Admin Phone Number</label>
              <input
                type="number"
                className="halfWidth"
                id="adminPhoneNumber"
                name="adminPhoneNumber"
                value={companyInfo.adminPhoneNumber}
                onChange={this.handleChange}
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
              />
              <span className="domainName">
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
                placeholder="Enter your password"
                value={companyInfo.password}
                onChange={this.handleChange}
              />
              {/* <label>Admin Confirm Password</label> */}
              <input
                type="password"
                className="halfWidth"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                value={companyInfo.confirmPassword}
                onChange={this.handleChange}
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
              />
              <br />
              {/* <label>(All fields are mandatory)</label> */}
            </form>
          </div>
        </div>
        <div className="container">
          <div className="subContainer customer ">
            <div className="customerHeading">
              <span className="billableId">Billable ID</span>
              {/* <span className="planId">Plan ID</span> */}
              <span className="cirlce">Circle ID</span>
              <span className="firstName">First Name</span>
              <span className="lastName">Last Name</span>
              <span className="phoneNumber">Phone Number</span>
              <span className="emailId">Email ID</span>
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
