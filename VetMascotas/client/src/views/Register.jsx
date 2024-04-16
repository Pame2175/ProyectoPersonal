import UserForm from "../components/UserForm";

const LoginRegister = () => {
    return (
        <div className="container mt-3">
            <h1 className="text-center">VetMascotas</h1>
            <hr />
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-8 mx-auto">
                    <UserForm formType="registro" />
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
