const API_URL = "http://localhost:8000";


export async function createCareerProfile(
  profileData,
  accessToken
) {
  const response = await fetch(
    `${API_URL}/career-profile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to create career profile"
    );
  }

  return data;
}


export async function getCareerProfile(
  accessToken
) {
  const response = await fetch(
    `${API_URL}/career-profile/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.detail || "Failed to get career profile"
    );

    error.status = response.status;

    throw error;
  }

  return data;
}


export async function updateCareerProfile(
  profileData,
  accessToken
) {
  const response = await fetch(
    `${API_URL}/career-profile/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to update career profile"
    );
  }

  return data;
}


export async function deleteCareerProfile(
  accessToken
) {
  const response = await fetch(
    `${API_URL}/career-profile/me`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail || "Failed to delete career profile"
    );
  }
}