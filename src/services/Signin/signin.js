import ApiServices from '../api.services';

const SigninService = {
  signin(data) {
    return ApiServices.post('Account/GenerateToken', data);
  },
}

export default SigninService