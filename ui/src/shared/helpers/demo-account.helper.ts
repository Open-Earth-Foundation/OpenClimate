import { DemoData } from "../../api/data/demo/entities.demo";
import { organizationService } from "../services/organization.service";
import { pledgeService } from "../services/pledge.service";
import { siteService } from "../services/site.service";
import { userService } from "../services/user.service";

async function demoOrganizationExists() {
  if (DemoData.DemoOrganization.organization_credential_id) {
    const demoUser = await organizationService.getByCredentialId(
      DemoData.DemoOrganization.organization_credential_id
    );

    if (Object.keys(demoUser).length) return true;
    else return false;
  }
}

async function PrepareDemoAccount() {
  const orgExists = await demoOrganizationExists();

  if (!orgExists) await SaveDemoDataToDb();
}

async function SaveDemoDataToDb() {
  await organizationService.saveOrganization(DemoData.DemoOrganization);
  if (DemoData.DemoOrganization.organization_credential_id) {
    const org = await organizationService.getByCredentialId(
      DemoData.DemoOrganization.organization_credential_id
    );
    userService.register(DemoData.DemoUser);
    if (org.id) {
      siteService.saveSite(org.id, DemoData.DemoSite);
      pledgeService.savePledge(org.id, DemoData.DemoPledge);
    }
  }
}

export const DemoHelper = {
  PrepareDemoAccount,
};
