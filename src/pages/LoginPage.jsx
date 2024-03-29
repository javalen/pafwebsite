import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import pb from "../api/pocketbase";
import useAuth from "../auth/useAuth";
import useFacility from "../data/facility";

const clazz = "LoginPage";
const LoginPage = () => {
  const [loading, setLoading] = useState();
  const [err, setErr] = useState("");
  const auth = useAuth();
  const facilityData = useFacility();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = async (data) => {
    setLoading(true);
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(data.email, data.password);
      const user = authData.record;

      facilityData.reloadAllFaciilities();
      const facility_map = await pb.collection("personel").getList(1, 500, {
        filter: 'user_id= "' + user.id + '"',
        fields: "role, fac_id",
      });

      if (facility_map.items.length == 0) {
        // Check if user has divisional entries
        const division_map = await pb
          .collection("division_user")
          .getList(1, 500, {
            filter: 'user_id="' + user.id + '"',
          });

        if (division_map.items.length > 0) {
          // get all of the facilities in a given division
          const facitilies = [];
          division_map.items.forEach(async (div) => {
            const division_facs = await pb
              .collection("facility")
              .getList(1, 50, {
                filter: 'division="' + div.division_id + '"',
              });
            division_facs.items.forEach(async (fac) => {
              facitilies.push({ fac_id: fac.id, role: "corp" });
            });
            user.facility_map = facitilies;
          });
        }
      } else {
        // add the map to the user
        user.facility_map = facility_map.items;
      }
      auth.logIn(user);
      auth.setUser(user);
      navigate("/home", { state: user });
    } catch (error) {
      setLoading(false);
      setErr(error.message);
      console.log(" 24 Error logging in [" + error);
    }
    setLoading(false);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            src={Logo}
            alt="Logo"
            className="flex-1 w-1/4 object-center sm:max-w-md"
          />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          {err && (
            <h1 className="text-xs text-center font-normal leading-tight tracking-tight text-red-600 md:text-2xl dark:text-red-200">
              Username/Password are invalid
            </h1>
          )}

          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to PMP Mobile App Manager
            </h1>
            <form
              onSubmit={handleSubmit((data) => {
                console.log(data);
                login(data);
              })}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  id="email"
                  autoComplete="false"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@some.com"
                  required=""
                />
                <p className="text-red-300">{errors.email?.message}</p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 4, message: "Minimum length is 4" },
                  })}
                  autoComplete="false"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
                <p className="text-red-300">{errors.password?.message}</p>
              </div>
              <div className="flex items-center justify-between">
                {/* <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div> */}
                {/* <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a> */}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-pmp_primary hover:bg-pmp_primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pmp_primary-600 dark:hover:bg-pmp_primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
