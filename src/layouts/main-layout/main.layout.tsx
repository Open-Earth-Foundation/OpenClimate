import { FunctionComponent, useEffect } from 'react';
import LoginCredential from '../../shared/components/modals/login-credential/login-credential.modal';
import LoginModal from '../../shared/components/modals/login/login.modal';
import RegistrationModal from '../../shared/components/modals/registration/registration.modal';
import MainToolbar from '../../shared/components/toolbar/toolbar';
import './main.layout.scss';

import {
  Switch,
  Route
} from "react-router-dom";
import ReviewPage from  '../../components/review/review.page';
import { DispatchThunk, RootState } from '../../store/root-state';
import { doLogin, doLogout } from '../../store/user/user.actions';
import { connect } from 'react-redux'
import AccountPage from '../../components/account/account.page';
import VerifyInformationModal from '../../shared/components/modals/verify-information/verify-information.modal';
import * as userSelectors from '../../store/user/user.selectors';
import * as appSelectors from '../../store/app/app.selectors';
import { showModal } from '../../store/app/app.actions';
import Modal from '../../shared/components/modals/modal/modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IUser } from '../../api/models/User/IUser';
import NestedAccountsPage from '../../components/nested-accounts/nested-accounts.page';

interface Props  {
  currentUser: IUser | null,
  loading: boolean,
  showModal: (type: string) => void,
  doLogout: () => void
}

const MainLayout: FunctionComponent<Props> = (props) => {

  const { currentUser, loading, showModal, doLogout } = props;
  
  useEffect(() => {
    document.addEventListener("wheel", function(event) {
        if(document)
        {
          if(document.activeElement instanceof HTMLInputElement)
          {
            const element = document.activeElement as HTMLInputElement;
            if(element.type === "number")
              element.blur();
          }
        }
    });
  }, []);

  return (
    <div className="main-layout">
      <MainToolbar 
        showLoginModal = {() =>  showModal('login') }
        user = {currentUser}
        doLogout= {doLogout}
      />
      <div className="main-layout__wrapper">
        <Switch>
          {
          currentUser && ( 
          <Route path="/account">
            <AccountPage user={currentUser}/>
          </Route>
          )}
          <Route path="/nested-accounts">
            <NestedAccountsPage />
          </Route>
          <Route path="/">
            <ReviewPage />
          </Route>
        </Switch>
      </div>

      <Modal />
      <ToastContainer 
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        toastStyle={{ backgroundColor: "#007568", color: "white" }} 

      />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentUser: userSelectors.getCurrentUser(state),
    loading: userSelectors.getLoading(state),
  }
}

const mapDispatchToProps = (dispatch: DispatchThunk) => {
  return {
    showModal: (type:string) => {
      dispatch(showModal(type))
    },
    doLogout: () => {
      dispatch(doLogout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
