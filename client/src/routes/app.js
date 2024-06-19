
import { Dashboard } from 'views/dashboard/dashboard';
import { Help } from 'views/dashboard/help';
import { OnboardingView } from 'views/onboarding/onboarding';
import SalesforceLogin from "views/auth/multi_level/SalesforceLogin";
import SetupAuditTrailTable from "views/setupAuditTrail/SetupAuditTrail";
import TrailDB from "../views/setupAuditTrail/TrailDB";
import PrimeTable from 'views/setupAuditTrail/PrimeTable';
import LinkedlnScrap from 'views/LinkedScrap/LinkedlnScrap';

const Routes = [
  {
    path: '/dashboard',
    view: Dashboard,
    layout: 'app',
    permission: 'user',
    title: 'dashboard.title'
  },
  {
    path: '/welcome',
    view: OnboardingView,
    layout: 'onboarding',
    permission: 'user',
    title: 'onboarding.title'
  },
  {
    path: '/help',
    view: Help,
    layout: 'app',
    permission: 'user',
    title: 'help.title'
  },
  {
    path:"/salesforceLogin",
    view : SalesforceLogin,
    layout:'app',
    permission:"user",
    title:""
  },
  {
    path:"/notworkinganymore",
    view : SetupAuditTrailTable,
    layout:'app',
    permission:"user",
    title:"Salesforce Meta Data"
  },{
    path:"/reactTable",
    view:TrailDB,
    layout:'app',
    permission:"user",
    title:"Trails in DB"
  },{
    path:"/salesforce/metaData",
    view:PrimeTable,
    layout:'app',
    permission:"user",
    title:"Prime Table"
  },
  {
    path:"/setupAudit",
    view:TrailDB,
    layout:"app",
    permission:"user",
    title:"Trail DB"
  },{
    path:"/linkedScrap/dashboard",
    view:LinkedlnScrap,
    layout:"app",
    permission:"user",
    title:"LinkedInScrap"
  }
]

export default Routes;
