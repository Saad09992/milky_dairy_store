import { Card, CardBody } from "@windmill/react-ui";
import useAuth from "../hooks/useAuth";
import RootLayout from "../layout/RootLayout";
import AccountForm from "../components/AccountForm";
import AddressForm from "../components/AddressForm";

const Account = () => {
  const { userData, loading } = useAuth();

  return (
    <RootLayout loading={loading}>
      <div className="container py-20 mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-8">Account Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <AccountForm userData={userData} />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Address Information</h2>
              <AddressForm userData={userData} />
            </CardBody>
          </Card>
        </div>
      </div>
    </RootLayout>
  );
};

export default Account;
