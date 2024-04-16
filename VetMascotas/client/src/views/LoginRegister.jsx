import UserForm from "../components/UserForm";

const LoginRegister = () => {
    return (
        <div className="container mt-3">
            <h1 className="text-center">VetMascotas</h1>
            <hr />
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-80 mx-auto">
                    <UserForm formType="login" />
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
