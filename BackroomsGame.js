using UnityEngine;
using UnityEngine.AI;

public class BackroomsGame : MonoBehaviour
{
    public Transform player;
    public Transform monster;
    public NavMeshAgent monsterAgent;
    public GameObject[] walls;

    void Start()
    {
        // Initialize walls with collisions
        foreach (var wall in walls)
        {
            wall.AddComponent<BoxCollider>();
        }
    }

    void Update()
    {
        // Make the AI monster follow the player
        if (player != null && monsterAgent != null)
        {
            monsterAgent.SetDestination(player.position);
        }
    }
}