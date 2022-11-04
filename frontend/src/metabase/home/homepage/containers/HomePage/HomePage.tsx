import { connect } from "react-redux";
import { openNavbar, closeNavbar } from "metabase/redux/app";
import HomePage from "../../components/HomePage";

const mapDispatchToProps = {
  onOpenNavbar: openNavbar,
  onCloseNavbar: closeNavbar,
};

export default connect(null, mapDispatchToProps)(HomePage);
