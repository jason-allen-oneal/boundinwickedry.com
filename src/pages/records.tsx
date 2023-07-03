import type { NextPage } from "next";
import Layout from "@/components/Layout";

const Records: NextPage = () => {
  const pageData = {
    title: "Record Keeping Compliance",
    description: "",
  };

  return (
    <Layout data={pageData}>
      <div className="border border-secondary p-4">
        <h2 className="font-bold text-2xl mb-4">
          18 U.S.C. §2257 Record Keeping Requirements Compliance Statement
        </h2>
        <p>
          The operator of Bound In Wickedry is not the producer (whether primary
          or secondary as defined in 18 U.S.C. § 2257) of any of the content
          found on Bound In Wickedry. The operator's activities, with respect to
          such content, are limited to the transmission, storage, retrieval,
          hosting and/or formatting of depictions posted by third party users,
          on areas of the website under the user's control.
        </p>
        <p>
          Please direct any request you may have regarding §2257 records in
          relation to any content found on Bound In Wickedry, directly to the
          respective uploader, amateur, producer, studio or account holder of
          the content (“Verified Uploaders”).
        </p>
        <p>
          For further assistance in communicating with the Verified Uploaders or
          any questions regarding this notice, please contact Bound In
          Wickedry's compliance department at support@boundinwickedry.com.
        </p>
        <p>
          Bound In Wickedry abides by the following strict compliance procedures
          regarding uploaded content:
        </p>
        <ul>
          <li>
            All Verified Uploaders must be over eighteen (18) years of age (or
            age required by their State, jurisdiction or Country if more than 18
            years old) and are personally identified and verified by Bound In
            Wickedry at account activation prior to being able to upload, share
            and sell content on Bound In Wickedry;
          </li>
          <li>
            Prior to uploads, Bound In Wickedry ensures that all Verified
            Uploaders, provide evidence or certify that:
            <ul>
              <li>
                all individuals appearing in the content are over the age of 18
                years old (or minimal age required to appear in such content by
                their State, jurisdiction or Country if more than 18 years old);
                that they freely consented to appear in the content at the time
                of its production and agree to its upload on Bound In Wickedry;
              </li>
              <li>
                as producer of said content, the Verified Uploader certifies
                being compliant with record keeping requirements under U.S.C. §
                2257 for all content uploaded on Bound In Wickedry, and agrees
                to deliver such documentation promptly upon request;
              </li>
              <li>
                the uploaded content does not violate Bound In Wickedry's Terms
                of Service, and any of its related policies namely but without
                limitation, its Child Sexual Abuse Material Policy, or
                Non-Consensual Content Policy.
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default Records;
