import PersonalInformation from "@/app/components/account/PersonalInformation.jsx";

export default function Profile() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-primary-text text-2xl">Profile</h2>
        <p className="text-secondary-text">
          View & Update Your Personal and Contact Information
        </p>
      </div>
      <PersonalInformation />
    </div>
  );
}
