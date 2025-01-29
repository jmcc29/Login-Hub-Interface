"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { apiServerFrontend } from "@/services";
import { useRouter } from "next/navigation";
import { useAlert } from "@/hooks/useAlerts";

interface FormData {
  user: string;
  password: string;
}

const MuserpolLogo = () => (
  <svg
    viewBox="0 0 200 60"
    xmlns="https://www.w3.org/2000/svg"
    className="flex flex-row w-full h-20 m-2"
  >
    <image href="muserpol-logo.png" x="10" y="-8" width="180" height="80" />
  </svg>
);

const classNames = {
  label: "text-black font-bold text-lg/2",
  inputWrapper: ["shadow-xl", "backdrop-blur-xl", "backdrop-saturate-200"],
};

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    user: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const { Alert } = useAlert();

  const handleRedirect = () => {
    router.push("/apphub");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): Boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.user) {
      newErrors.user = "El usuario es requerido";
    } else if (!/^[a-zA-Z]+$/.test(formData.user)) {
      newErrors.user = "El usuario solo debe contener letras";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!validateForm()) return;
      const response = await apiServerFrontend.POST("/api/login/", {
        username: formData.user,
        password: formData.password,
      });
      const data = await response.json();
      if (!data.error) {
        setTimeout(() => {
          handleRedirect();
        }, 1000);
        setIsAnimating(true);
        setIsLoading(true);
      } else {
        setIsAnimating(false);
        setIsLoading(false);
        Alert({ message: `${data.message}`, variant: "error" });
      }
    } catch (error) {
      setIsAnimating(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {!isAnimating && (
        <motion.div
          className="flex items-center border-20 justify-center min-h-screen bg-gradient-to-br from-stone-100 to-stone-200"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            className="flex w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="hidden lg:block lg:w-1/2 bg-cover bg-center "
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ x: 0, width: "100%" }}
              transition={{ duration: 1 }}
              style={{
                backgroundImage: "url('muserpol.jpg')",
              }}
            ></motion.div>
            <motion.div
              className="w-full lg:w-1/2 p-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Card
                className="w-full py-2 px-8 border-1"
                shadow="none"
                radius="none"
              >
                <form onSubmit={handleSubmit} className="pb-5">
                  <CardHeader className="flex flex-col space-y-1">
                    <MuserpolLogo />
                    <h1 className="flex flex-row text-2xl font-bold text-center">
                      Iniciar sesión
                    </h1>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        id="user"
                        label="Usuario"
                        labelPlacement="outside"
                        name="user"
                        type="text"
                        variant="flat"
                        placeholder="Ingrese su usuario"
                        required
                        radius="sm"
                        errorMessage="Por favor ingrese su usuario"
                        classNames={classNames}
                        value={formData.user}
                        onChange={handleInputChange}
                        aria-invalid={!!errors.user}
                        aria-describedby={
                          errors.user ? "user-error" : undefined
                        }
                      />
                      {errors.user && (
                        <p id="user-error" className="text-sm text-red-400">
                          {errors.user}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          label="Contraseña"
                          labelPlacement="outside"
                          type={showPassword ? "text" : "password"}
                          variant="flat"
                          placeholder="Ingrese su contraseña"
                          required
                          radius="sm"
                          isInvalid={false}
                          errorMessage="Por favor ingrese su contraseña"
                          classNames={classNames}
                          onChange={handleInputChange}
                          endContent={
                            <button
                              className="focus:outline-none"
                              type="button"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <FontAwesomeIcon
                                  className="h-5 w-5"
                                  icon={faEye}
                                />
                              ) : (
                                <FontAwesomeIcon
                                  className="h-5 w-5"
                                  icon={faEyeSlash}
                                />
                              )}
                            </button>
                          }
                          value={formData.password}
                          aria-invalid={!!errors.password}
                          aria-describedby={
                            errors.password ? "password-error" : undefined
                          }
                        />
                      </div>
                      {errors.password && (
                        <p id="password-error" className="text-sm text-red-400">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="shadow-xl">
                      <Button
                        variant="flat"
                        className="space-y-4 w-full bg-lime-700 text-white font-bold"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Iniciado sesión..." : "INICIAR SESIÓN"}
                      </Button>
                    </div>
                  </CardBody>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
