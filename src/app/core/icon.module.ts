import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import {
  faAddressBook,
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faArrowAltCircleRight,
  faArrowLeft,
  faArrowRight,
  faArrowsAlt,
  faBalanceScale,
  faBan,
  faBars,
  faBriefcase,
  faCalendarDay,
  faCheck,
  faCheckCircle,
  faCog,
  faCogs,
  faEllipsisH,
  faEnvelope,
  faFastForward,
  faFax,
  faGear,
  faGlobeAmericas,
  faHeart,
  faHome,
  faInbox,
  faInfoCircle,
  faList,
  faListAlt,
  faMapMarkerAlt,
  faMinus,
  faPaperPlane,
  faPencilAlt,
  faPhone,
  faPlayCircle,
  faPlus,
  faPrint,
  faQuestionCircle,
  faRightFromBracket,
  faSearch,
  faShoppingCart,
  faSpinner,
  faStar,
  faStarHalf,
  faTh,
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faUndo,
  faUser,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule],
})
export class IconModule {
  constructor(library: FaIconLibrary) {
    config.autoAddCss = false;
    library.addIcons(
      faAddressBook,
      faAngleDown,
      faAngleLeft,
      faAngleRight,
      faAngleUp,
      faArrowAltCircleRight,
      faArrowLeft,
      faArrowRight,
      faArrowsAlt,
      faBalanceScale,
      faBan,
      faBars,
      faBriefcase,
      faCalendarDay,
      faCheck,
      faCheckCircle,
      faCog,
      faCogs,
      faEllipsisH,
      faEnvelope,
      faFastForward,
      faFax,
      faGear,
      faGlobeAmericas,
      faHeart,
      faHome,
      faInbox,
      faInfoCircle,
      faList,
      faListAlt,
      faMapMarkerAlt,
      faMinus,
      faPaperPlane,
      faPencilAlt,
      faPhone,
      faPlayCircle,
      faPlus,
      faPrint,
      faQuestionCircle,
      faRightFromBracket,
      faSearch,
      faShoppingCart,
      faSpinner,
      faStar,
      faStarHalf,
      faTh,
      faTimes,
      faTimesCircle,
      faTrashAlt,
      faUndo,
      faUser,
      faUserCheck
    );
  }
}
